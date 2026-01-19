import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const suppliers = [
  // Grupo 1
  { code: "2", name: "MEXICHEM BRASIL IND. TRANSF. PLAST.LTDA AMANCO", group: "Grupo 1" },
  { code: "6289", name: "FERTAK COMERCIO E IMPORTACAO LTDA EPP", group: "Grupo 1" },
  { code: "5627", name: "FORTLEV INDUSTRIA E COMERCIO DE PLASTICOS", group: "Grupo 1" },
  { code: "6291", name: "ILUMI INDUTRIA E COMERCIO LTDA", group: "Grupo 1" },
  { code: "6219", name: "NOVAFORMA PLASTICOS LTDA", group: "Grupo 1" },
  { code: "5793", name: "AEROFLEX IND DE AEROSOL LTDA", group: "Grupo 1" },
  { code: "300", name: "INDUSTRIA DE PLASTICOS HERC LTDA", group: "Grupo 1" },
  { code: "6215", name: "PINCEIS ROMA LTDA", group: "Grupo 1" },
  { code: "761", name: "MAX METALURGICA LTDA", group: "Grupo 1" },
  { code: "8726", name: "UNIFORTTE INDUSTRIA DE PLASTICOS LTDA", group: "Grupo 1" },
  { code: "6288", name: "ATB INDUSTRIA E COMERCIO DE ADESIVOS LTDA", group: "Grupo 1" },
  { code: "259", name: "LPS COMPANY LTDA", group: "Grupo 1" },
  { code: "333", name: "IND E COM DE METAIS LEAO SPESSIA EIRELLI", group: "Grupo 1" },
  { code: "84", name: "GERDAU ACOS LONGOS S/A", group: "Grupo 1" },
  { code: "717", name: "STAM METALURGICA S/A", group: "Grupo 1" },
  { code: "150", name: "SAINT-GOBAIN PRODUTOS IND.E CONST. LTDA", group: "Grupo 1" },
  { code: "11", name: "FABRIMAR S.A. INDUSTRIA E COMERCIO", group: "Grupo 1" },
  // Grupo 2
  { code: "820", name: "MULTILIT INDUSTRIA E COMERCIO LTDA.", group: "Grupo 2" },
  { code: "4301", name: "LORENZETTI LOUCAS LTDA", group: "Grupo 2" },
  { code: "692", name: "TINTAS HIDRACOR S/A", group: "Grupo 2" },
  { code: "308", name: "IBMF- IND DE MATERIAIS P/CONSTRUCAO LTDA", group: "Grupo 2" },
  { code: "738", name: "JUNTALIDER IND COM DE MAT P/CONST LTDA", group: "Grupo 2" },
  { code: "159", name: "CIA INDUSTRIAL H. CARLOS SCHNEIDER", group: "Grupo 2" },
  { code: "767", name: "ADERE PRODUTOS AUTO-ADESIVOS LTDA", group: "Grupo 2" },
  { code: "239", name: "VIQUA INDUSTRIA PLASTICOS LTDA", group: "Grupo 2" },
  { code: "361", name: "SINTEX INDUSTRIAL DE PLASTICOSLTDA", group: "Grupo 2" },
  { code: "257", name: "HENKEL LTDA", group: "Grupo 2" },
  { code: "801", name: "MULTI INDUSTRIAL E COMERCIAL LTDA (FC)", group: "Grupo 2" },
  { code: "8794", name: "MAJE DO NORDESTE IND E COM DE MATS ELETRICOS LTDA", group: "Grupo 2" },
  { code: "570", name: "IRWIN INDUST TOOL FERRAM DO BRASIL LTDA", group: "Grupo 2" },
  { code: "5842", name: "METALURGICA LOTH LTDA", group: "Grupo 2" },
  { code: "8732", name: "MORLAN S.A", group: "Grupo 2" },
  { code: "341", name: "TRIFIXI INDUSTRIA E COMERCIO LTDA", group: "Grupo 2" },
  { code: "6228", name: "BAUMINAS HIDROAZUL IND E COM LTDA", group: "Grupo 2" },
  { code: "897", name: "BOMCORTE FERRAMENTAS LTDA", group: "Grupo 2" },
  { code: "32", name: "DOCOL INDUSTRIA E COMERCIO LTDA", group: "Grupo 2" },
  { code: "6845", name: "CORTAG INDUSTRIA E COMERCIO LTDA", group: "Grupo 2" },
  { code: "42", name: "PULVITEC DO BRASIL IND COLAS ADES LTDA", group: "Grupo 2" },
  { code: "206", name: "ATLAS S/A", group: "Grupo 2" },
  // Grupo 3
  { code: "430", name: "LORENZETTI S/A IND BRAS ELETROMETALURGICAS", group: "Grupo 3" },
  { code: "550", name: "SAINT-GOBAIN DO BRASIL PRODUTOS INDUSTRIAIS E PARA CONSTRUCA", group: "Grupo 3" },
  { code: "5802", name: "SIKA S.A ( CIPLAK )", group: "Grupo 3" },
  { code: "6300", name: "ABB ELETRIFICACAO LTDA", group: "Grupo 3" },
  { code: "8728", name: "MOGI FLEX QUIMICA E COMERCIO EIRELLI", group: "Grupo 3" },
  { code: "157", name: "3M DO BRASIL LTDA.", group: "Grupo 3" },
  { code: "733", name: "ASTRA S.A.INDUSTRIA E COMERCIO", group: "Grupo 3" },
  { code: "8753", name: "PIRES DO RIO CIBRAÇO COMÉRCIO INDÚSTRIA DE FERRO E AÇO LTDA", group: "Grupo 3" },
  { code: "6301", name: "AFORT INDUSTRIA DE PLASTICOS LTDA", group: "Grupo 3" },
  { code: "8110", name: "JOPACK INDUSTRIAL EIRELLI", group: "Grupo 3" },
  { code: "14", name: "STARRETT INDUSTRIA E COMERCIO LTDA.", group: "Grupo 3" },
  { code: "6099", name: "ARIM COMPONENTES S/A", group: "Grupo 3" },
  { code: "258", name: "UNIVERSO TINTAS E VERNIZES LTDA.", group: "Grupo 3" },
  { code: "1153", name: "VEDATUDO IND.ECOM.DE ADES. E SELAN.LTDA.", group: "Grupo 3" },
  { code: "271", name: "COMEP INDUSTRIA E COMERCIO LTDA", group: "Grupo 3" },
  { code: "8705", name: "SKANDIA INDUSTRIA DE TINTAS E REVESTIMENTOS LTDA", group: "Grupo 3" },
  { code: "6107", name: "EMERSON QUIMICA LTDA", group: "Grupo 3" },
  { code: "8737", name: "FECHADURAS HELA DE FRIBURGO FERRAGENS LTDA", group: "Grupo 3" },
  { code: "6036", name: "BRAFT DO BRASIL IMPORTACAO E EXPORTACAO LTDA", group: "Grupo 3" },
  { code: "8718", name: "IMPERIO DOS PLASTICOS INDUSTRIA E COMERCIO LTDA", group: "Grupo 3" },
  { code: "8778", name: "RIO CHEN'S IMPORTADORA E EXPORTADORA LTDA", group: "Grupo 3" },
  { code: "6400", name: "CIMFLEX IND. COM. PLASTICOS LTDA", group: "Grupo 3" },
  { code: "8788", name: "ASSA ABLOY BRASIL INDUSTRIA E COMERCIO LTDA", group: "Grupo 3" },
  { code: "316", name: "TENACE INDUSTRIA E COMERCIO LTDA", group: "Grupo 3" },
  { code: "6024", name: "Z.M.A PERFIL ALUMINIO LTDA", group: "Grupo 3" },
  { code: "8782", name: "ARARAS QUIMICA DO BRASIL", group: "Grupo 3" },
  { code: "732", name: "MEGATONS PROD QUIM IND E COM LTDA", group: "Grupo 3" },
  { code: "10", name: "DEXCO S/A", group: "Grupo 3" },
  { code: "812", name: "MAESTRO DO BRASIL INDUSTRIA METALURGICA LTDA", group: "Grupo 3" },
  { code: "8800", name: "QUALITY IND DE ESQUADRIAS E MANGUEIRAS DO NORDESTE UNIPESSOA", group: "Grupo 3" },
  { code: "9884", name: "PEDREIRA SAO SEBASTIAO LTDA", group: "Grupo 3" },
  { code: "5839", name: "JIMO QUIMICA INDUSTRIAL LTDA", group: "Grupo 3" },
  { code: "187", name: "BELMAR METAIS IND E COM. LTDA", group: "Grupo 3" },
  { code: "53", name: "TML PLASTICOS LTDA-ME", group: "Grupo 3" },
  { code: "5895", name: "PARGO MEDIL MERCANTIL E DISTRIBUIDORA LTDA", group: "Grupo 3" },
  { code: "115", name: "BRAWNER COMERCIO E METAIS LTDA", group: "Grupo 3" },
  { code: "8723", name: "GNX INDUSTRIA E COMERCIO", group: "Grupo 3" },
  { code: "5815", name: "METALURGICA INCA LTDA", group: "Grupo 3" },
  { code: "65", name: "ESFERA ESTAMPARIA DE FERRO E ACO  LTDA.", group: "Grupo 3" },
  { code: "269", name: "PERLEX PRODUTOS PLASTICOS LTDA", group: "Grupo 3" },
  { code: "8744", name: "NEO IMPORTS COMERCIAL EIRELLI", group: "Grupo 3" },
  { code: "8773", name: "TECNOCABO M.C.I. IND. DE CON ELETRICAS EIRELLI", group: "Grupo 3" },
  { code: "5564", name: "PARANAPANEMA S/A", group: "Grupo 3" },
  { code: "5894", name: "BLACK & DECKER DO BRASIL LTDA", group: "Grupo 3" },
  { code: "7", name: "APOLO TUBOS E EQUIPAMENTOS S/A", group: "Grupo 3" },
  { code: "787", name: "I.F.C. INDUSTRIA E COMERCIO DE CONDUTORES ELETRICOS", group: "Grupo 3" },
  { code: "8747", name: "VENTISOL INDUSTRIA E COMERCIO S.A", group: "Grupo 3" },
  { code: "711", name: "INDUSTRIA DE CALCADOS SEG. HAGIOS LTDA", group: "Grupo 3" },
  { code: "8", name: "TUPY S.A.", group: "Grupo 3" },
  { code: "6227", name: "PLASTIBRAS INDUSTRIA E COMERCIO LTDA", group: "Grupo 3" },
  { code: "892", name: "SELENA SULAMERICANA IND COM PR QUIMICA LTDA", group: "Grupo 3" },
  { code: "8767", name: "PLASTICOS LUCONI LTDA.", group: "Grupo 3" },
  { code: "8746", name: "BSM INDUSTRIA E FERRAMENTARIA EIRELLI ME", group: "Grupo 3" },
  { code: "796", name: "FABRICA DE TELAS SAO JORGE", group: "Grupo 3" },
  { code: "6360", name: "MAXI RUBBER INDUSTRIAS QUIMICAS LTDA", group: "Grupo 3" },
  { code: "6031", name: "QUALITRONIX TECNOLOGIA LTDA", group: "Grupo 3" }
];

async function main() {
  for (const supplier of suppliers) {
    await prisma.supplier.upsert({
      where: { code: supplier.code },
      update: supplier,
      create: supplier
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
