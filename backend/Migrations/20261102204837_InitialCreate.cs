using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Vaquita.Api.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Rubros",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Rubros", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Usuarios",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Apellido = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Nombre = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Apodo = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    FechaAlta = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UltimoGrupoId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Usuarios", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Grupos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Descripcion = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Activo = table.Column<bool>(type: "bit", nullable: false),
                    FechaCreacion = table.Column<DateTime>(type: "datetime2", nullable: false),
                    AdminId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Grupos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Grupos_Usuarios_AdminId",
                        column: x => x.AdminId,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "LoginTokens",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UsuarioId = table.Column<int>(type: "int", nullable: false),
                    Token = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Expira = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Usado = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LoginTokens", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LoginTokens_Usuarios_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Gastos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    GrupoId = table.Column<int>(type: "int", nullable: false),
                    PagadorId = table.Column<int>(type: "int", nullable: false),
                    CargadoPorId = table.Column<int>(type: "int", nullable: false),
                    Importe = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Descripcion = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    RubroId = table.Column<int>(type: "int", nullable: true),
                    Fecha = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Gastos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Gastos_Grupos_GrupoId",
                        column: x => x.GrupoId,
                        principalTable: "Grupos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Gastos_Rubros_RubroId",
                        column: x => x.RubroId,
                        principalTable: "Rubros",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Gastos_Usuarios_CargadoPorId",
                        column: x => x.CargadoPorId,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Gastos_Usuarios_PagadorId",
                        column: x => x.PagadorId,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "GruposUsuarios",
                columns: table => new
                {
                    GrupoId = table.Column<int>(type: "int", nullable: false),
                    UsuarioId = table.Column<int>(type: "int", nullable: false),
                    FechaIngreso = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GruposUsuarios", x => new { x.GrupoId, x.UsuarioId });
                    table.ForeignKey(
                        name: "FK_GruposUsuarios_Grupos_GrupoId",
                        column: x => x.GrupoId,
                        principalTable: "Grupos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_GruposUsuarios_Usuarios_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Pagos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    GrupoId = table.Column<int>(type: "int", nullable: false),
                    DeudorId = table.Column<int>(type: "int", nullable: false),
                    AcreedorId = table.Column<int>(type: "int", nullable: false),
                    Importe = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Fecha = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Pagos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Pagos_Grupos_GrupoId",
                        column: x => x.GrupoId,
                        principalTable: "Grupos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Pagos_Usuarios_AcreedorId",
                        column: x => x.AcreedorId,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Pagos_Usuarios_DeudorId",
                        column: x => x.DeudorId,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "Rubros",
                columns: new[] { "Id", "Nombre" },
                values: new object[,]
                {
                    { 1, "Combustible" },
                    { 2, "Comida" },
                    { 3, "Alojamiento" },
                    { 4, "Transporte" },
                    { 5, "Materiales" },
                    { 6, "Otros" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Gastos_CargadoPorId",
                table: "Gastos",
                column: "CargadoPorId");

            migrationBuilder.CreateIndex(
                name: "IX_Gastos_GrupoId",
                table: "Gastos",
                column: "GrupoId");

            migrationBuilder.CreateIndex(
                name: "IX_Gastos_PagadorId",
                table: "Gastos",
                column: "PagadorId");

            migrationBuilder.CreateIndex(
                name: "IX_Gastos_RubroId",
                table: "Gastos",
                column: "RubroId");

            migrationBuilder.CreateIndex(
                name: "IX_Grupos_AdminId",
                table: "Grupos",
                column: "AdminId");

            migrationBuilder.CreateIndex(
                name: "IX_GruposUsuarios_UsuarioId",
                table: "GruposUsuarios",
                column: "UsuarioId");

            migrationBuilder.CreateIndex(
                name: "IX_LoginTokens_Token",
                table: "LoginTokens",
                column: "Token",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_LoginTokens_UsuarioId",
                table: "LoginTokens",
                column: "UsuarioId");

            migrationBuilder.CreateIndex(
                name: "IX_Pagos_AcreedorId",
                table: "Pagos",
                column: "AcreedorId");

            migrationBuilder.CreateIndex(
                name: "IX_Pagos_DeudorId",
                table: "Pagos",
                column: "DeudorId");

            migrationBuilder.CreateIndex(
                name: "IX_Pagos_GrupoId",
                table: "Pagos",
                column: "GrupoId");

            migrationBuilder.CreateIndex(
                name: "IX_Usuarios_Email",
                table: "Usuarios",
                column: "Email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Gastos");

            migrationBuilder.DropTable(
                name: "GruposUsuarios");

            migrationBuilder.DropTable(
                name: "LoginTokens");

            migrationBuilder.DropTable(
                name: "Pagos");

            migrationBuilder.DropTable(
                name: "Rubros");

            migrationBuilder.DropTable(
                name: "Grupos");

            migrationBuilder.DropTable(
                name: "Usuarios");
        }
    }
}
