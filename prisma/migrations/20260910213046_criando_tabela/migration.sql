-- CreateTable
CREATE TABLE "Paciente" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "prontuario" TEXT,
    "idade" INTEGER,
    "statusProtocolo" TEXT,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Paciente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FichaACS" (
    "id" TEXT NOT NULL,
    "pacienteId" TEXT NOT NULL,
    "userId" TEXT,
    "dataColeta" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acsNome" TEXT,
    "mobilidade" TEXT,
    "abvd" TEXT,
    "intercorrencias" JSONB,
    "sintomas" TEXT,
    "sintomasFreq" TEXT,
    "cuidados" JSONB,
    "cuidadosOutro" TEXT,
    "dispositivos" TEXT,
    "medAlterado" TEXT,
    "medQual" TEXT,
    "cuidadorNome" TEXT,
    "cuidadorStatus" TEXT,
    "pioraRecente" TEXT,
    "necessidade" TEXT,
    "observacoes" JSONB,
    "alertaFinal" TEXT,
    "alertaQual" TEXT,

    CONSTRAINT "FichaACS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Triagem" (
    "id" TEXT NOT NULL,
    "pacienteId" TEXT NOT NULL,
    "userId" TEXT,
    "dataAvaliacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "origemDemanda" TEXT,
    "profissional" TEXT,
    "statusProtocolo" TEXT,
    "a1" JSONB,
    "alta" JSONB,
    "media" JSONB,
    "e3" JSONB,
    "classificacaoFinal" TEXT,
    "servicoResponsavel" TEXT,
    "frequenciaRecomendada" TEXT,
    "pontosIAEC" INTEGER,

    CONSTRAINT "Triagem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScoreEAD" (
    "id" TEXT NOT NULL,
    "pacienteId" TEXT NOT NULL,
    "userId" TEXT,
    "dataAvaliacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "statusProtocolo" TEXT,
    "origemDemanda" TEXT,
    "profissional" TEXT,
    "pontuacaoAnterior" INTEGER,
    "valores" JSONB,
    "scoreTotal" INTEGER,
    "classificacao" TEXT,
    "freqGeral" TEXT,
    "freqACS" TEXT,
    "freqEnf" TEXT,
    "freqMed" TEXT,

    CONSTRAINT "ScoreEAD_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FichaACS" ADD CONSTRAINT "FichaACS_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Triagem" ADD CONSTRAINT "Triagem_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScoreEAD" ADD CONSTRAINT "ScoreEAD_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente"("id") ON DELETE CASCADE ON UPDATE CASCADE;
