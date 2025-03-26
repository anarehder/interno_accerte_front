// src/services/graph.js
import { loginRequest } from "./authConfig";
import moment from 'moment';

async function getToken(instance, accounts) {
  if (accounts.length === 0) return null;

  try {
    const response = await instance.acquireTokenSilent({
      ...loginRequest,
      account: accounts[0],
    });
    
    return response;
  } catch (error) {
    console.error("Erro ao obter dados do usuário:", error);
    return null;
  }
}

export async function getUserProfile(instance, accounts) {
  try {
    const response = await getToken(instance, accounts);
    // console.log("userr", response);
    const graphResponse = await fetch("https://graph.microsoft.com/v1.0/me", {
      headers: {
        Authorization: `Bearer ${response.accessToken}`,
      },
    });

    return await graphResponse.json();
  } catch (error) {
    console.error("Erro ao obter dados do usuário:", error);
    return null;
  }
}

export async function getSharePointData(instance, accounts) {
 
  try {
    //const siteId = "accerte.sharepoint.com,b46c58c6-cfcd-46dc-90cd-4e9b1a07b7e0,f4fa6d69-985a-4c7a-8b8e-fe6ee707e7c3";
    //const displayName= "Accerte Tecnologia da Informação Ltda";
    const sharedDocumentsId = "b!xlhstM3P3EaQzU6bGge34Glt-vRamHpMi47-bucH58MDGgu4dgmNSJGRO0nIdQD1";

    const response = await getToken(instance, accounts);

  // PEGAR ID DO SITE
  // const graphResponse = await fetch(
  //   "https://graph.microsoft.com/v1.0/sites/accerte.sharepoint.com:/sites/AccerteTecnologiadaInformaoLtda",
  //   {
  //     headers: { Authorization: `Bearer ${response.accessToken}` }
  //   }
  // );
  // const siteData = await graphResponse.json();
  // console.log(siteData); // Salve este ID para a próxima etapa
  //PEGAR ID DO DRIVE DOCUMENTOS
  // const graphResponse = await fetch(
  //   `https://graph.microsoft.com/v1.0/sites/${siteId}/drives`,
  //   {
  //     headers: { Authorization: `Bearer ${response.accessToken}` }
  //   }
  // );
  // const drives = await graphResponse.json();
  // console.log(drives);
  //name:"Teams Wiki Data"
  // id:"b!xlhstM3P3EaQzU6bGge34Glt-vRamHpMi47-bucH58N_pfP09ZpKQJ4WX7V7ssSu"
  
  //PEGAR DA SHARED DOCUMENTS
  
  const politica = await fetch(
    `https://graph.microsoft.com/v1.0/drives/${sharedDocumentsId}/root:/Políticas:/children`,
    {
      headers: { Authorization: `Bearer ${response.accessToken}` }
    }
  );
  
  const files = await politica.json();
  const fileList = files.value.map(file => ({
    name: file.name,
    url: file.webUrl
  }));

  const codigos = await fetch(
    `https://graph.microsoft.com/v1.0/drives/${sharedDocumentsId}/root:/Código de Ética e Conduta:/children`,
    {
      headers: { Authorization: `Bearer ${response.accessToken}` }
    }
  );
  const files2 = await codigos.json();
  const fileList2 = files2.value.map(file => ({
    name: file.name,
    url: file.webUrl
  }));

  
  const processos = await fetch(
    `https://graph.microsoft.com/v1.0/drives/${sharedDocumentsId}/root:/Escritório de Processos:/children`,
    {
      headers: { Authorization: `Bearer ${response.accessToken}` }
    }
  );
  const files3 = await processos.json();
  const fileList3 = files3.value.map(file => ({
    name: file.name,
    url: file.webUrl
  }));

  const monthNumberPadded = moment().format('MM'); 
  const mes = new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(new Date()).toUpperCase();
  const mesAtual = `${monthNumberPadded} - ${mes}`
  
  const aniversarios = await fetch(
    `https://graph.microsoft.com/v1.0/drives/${sharedDocumentsId}/root:/Extras/ANIVERSARIANTES ACCERTE/${mesAtual}:/children`,
    {
      headers: { Authorization: `Bearer ${response.accessToken}` }
    }
  );
  const files4 = await aniversarios.json();
  
  const fileList4 = files4.value.map(file => ({
    name: file.name,
    url: file.webUrl
  }));

  const agenda = await fetch("https://graph.microsoft.com/v1.0/users?$top=999", {
        headers: {
          Authorization: `Bearer ${response.accessToken}`,
        },
      });

  const files5 = await agenda.json();
  const fileList5 = files5.value.map(file => ({
    name: file.displayName,
    givenName: file.givenName,
    surname: file.surname,
    jobTitle: file.jobTitle,
    mail: file.mail,
    mobilePhone: file.mobilePhone,
    officeLocation: file.officeLocation
  }));

  const calendario = await fetch(
    `https://graph.microsoft.com/v1.0/drives/${sharedDocumentsId}/root:/Calendários Accerte 2025:/children`,
    {
      headers: { Authorization: `Bearer ${response.accessToken}` }
    }
  );
  const files6 = await calendario.json();

  const fileList6 = files6.value.map(file => ({
    name: file.name,
    url: file.webUrl
  }));

  const responseObject = {'politicas': fileList, 'codigos': fileList2, 'processos': fileList3, 'aniversarios': fileList4, 'agenda': fileList5, 'calendario': fileList6};

  return responseObject;    

  }catch (error) {
    console.error("Erro ao obter dados do sharepoint:", error);
    return null;
  }
}