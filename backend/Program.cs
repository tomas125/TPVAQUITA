using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Vaquita.Api.Data;
using Vaquita.Api.Middlewares;
using Vaquita.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// ===== 1) Servicios =====
builder.Services.AddControllers();
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IUsuarioService, UsuarioService>();
builder.Services.AddScoped<IGrupoService, GrupoService>();
builder.Services.AddScoped<IGastoService, GastoService>();
builder.Services.AddScoped<ISaldoService, SaldoService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IAuthService, AuthService>();

// JWT: cómo se VALIDAN los tokens que llegan
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opciones => opciones.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
    });

// CORS: el front de Vite corre en otro origen
builder.Services.AddCors(opciones => opciones.AddPolicy("Frontend", politica =>
    politica.WithOrigins(builder.Configuration["FrontendUrl"] ?? "http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod()));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(opciones =>
{
    // Botón "Authorize" en Swagger
    opciones.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Ingresar: Bearer {token}"
    });
    opciones.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            new string[] { }
        }
    });
});

var app = builder.Build();

// ===== 2) Pipeline =====
app.UseMiddleware<ManejadorErroresMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("Frontend");   // antes de UseAuthentication
app.UseAuthentication();   // ¿quién sos?
app.UseAuthorization();    // ¿podés?
app.MapControllers();

app.Run();