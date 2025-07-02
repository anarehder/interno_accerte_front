// src/services/graph.js
import { loginRequest } from "./authConfig";
import moment from 'moment';

export async function getToken(instance, accounts) {
  if (accounts.length === 0) {
    console.warn("Nenhuma conta encontrada.");
    return null;
  }

  try {
    const response = await instance.acquireTokenSilent({
      ...loginRequest,
      account: accounts[0],
    });

    return response;
  } catch (error) {
    console.error("Erro ao obter dados do token:", error);
    return null;
  }
}

export async function getUserProfile(instance, accounts) {
  try {
    const response = await getToken(instance, accounts);
    const graphResponse = await fetch("https://graph.microsoft.com/v1.0/me", {
      headers: {
        Authorization: `Bearer ${response.accessToken}`,
      },
    });
    
    const details = await graphResponse.json();
    const user = {...details, 'token': response.accessToken};

    sessionStorage.setItem("userMSAL", JSON.stringify(user));
    return user;
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

  const teste = await fetch("https://graph.microsoft.com/v1.0/me/photo/$value",
      {
        headers: {
          Authorization: `Bearer ${response.accessToken}`,
        },
      });
  // const buffer = await teste.buffer();
  // const testee = await teste.json();
  // const base64 = buffer.toString("base64");
  const blob = await teste.blob();
  const imageUrl = URL.createObjectURL(blob);
  console.log(imageUrl);
  
  // console.log(testee);
  const hoje = new Date();
  const diaHoje = hoje.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit"
  }).replace("/", "-");

  const encontrado = fileList4.filter(aniv =>
    aniv.name.startsWith(diaHoje)
  );

  let aniversarioDia = encontrado || [];
  // console.log(aniversarioDia);
  const agenda = await fetch("https://graph.microsoft.com/v1.0/users?$filter=accountEnabled eq true&$select=id,displayName,givenName,surname,jobTitle,mail,mobilePhone,officeLocation,department,userPrincipalName&$top=999",
      {
        headers: {
          Authorization: `Bearer ${response.accessToken}`,
        },
      });
      
  const files5 = await agenda.json();
      
  const fileList5 = await Promise.all(
    files5.value
    .filter(f => f.officeLocation !== "NA" && f.officeLocation !== "OFF" && f.mail)
    .sort((a, b) => a.displayName.localeCompare(b.displayName))
    .map(async (file) => {
      let managerName = null;
      try {
        const managerRes = await fetch(`https://graph.microsoft.com/v1.0/users/${file.mail}/manager`, {
          headers: {
            Authorization: `Bearer ${response.accessToken}`,
          },
        });
  
        if (managerRes.ok) {
          const managerData = await managerRes.json();
          managerName = managerData.displayName || "-";
        } else {
          managerName = "-";
        }
      } catch (e) {
        managerName = "-";
      }
  
      return {
        name: file.displayName,
        givenName: file.givenName,
        surname: file.surname,
        jobTitle: file.jobTitle,
        mail: file.mail,
        mobilePhone: file.mobilePhone,
        officeLocation: file.officeLocation,
        department: file.department,
        manager: managerName,
      };
    })
  );

  const ano = new Date().getFullYear();
  const calendario = await fetch(
    `https://graph.microsoft.com/v1.0/drives/${sharedDocumentsId}/root:/Extras/CALENDARIOS/${ano}:/children`,
    {
      headers: { Authorization: `Bearer ${response.accessToken}` }
    }
  );

  const files6 = await calendario.json();

  const fileList6 = files6.value.map(file => ({
    name: file.name,
    url: file.webUrl
  }));

  const compliance = await fetch(
    `https://graph.microsoft.com/v1.0/drives/${sharedDocumentsId}/root:/Código de Ética e Conduta:/children`,
    {
      headers: { Authorization: `Bearer ${response.accessToken}` }
    }
  );
  const files7 = await compliance.json();

  const fileList7 = files7.value.map(file => ({
    name: file.name,
    url: file.webUrl
  }));

  const background = await fetch(
    `https://graph.microsoft.com/v1.0/drives/${sharedDocumentsId}/root:/Extras/PAPEL DE FUNDO:/children`,
    {
      headers: { Authorization: `Bearer ${response.accessToken}` }
    }
  );
  const files8 = await background.json();

  const fileList8 = files8.value.map(file => ({
    name: file.name,
    url: file.webUrl
  }));

  const banners = await fetch(
    `https://graph.microsoft.com/v1.0/drives/${sharedDocumentsId}/root:/Extras/BANNERS:/children`,
    {
      headers: { Authorization: `Bearer ${response.accessToken}` }
    }
  );
  const files9 = await banners.json();
  
  const fileList9 = files9.value.map(file => ({
    name: file.name,
    url: file.webUrl
  }));

  const docs = await fetch(
    `https://graph.microsoft.com/v1.0/drives/${sharedDocumentsId}/root:/Extras/DOCUMENTOS PADRAO:/children`,
    {
      headers: { Authorization: `Bearer ${response.accessToken}` }
    }
  );
  const files10 = await docs.json();

  const fileList10 = files10.value.map(file => ({
    name: file.name,
    url: file.webUrl
  }));

  const vagas = await fetch(
    `https://graph.microsoft.com/v1.0/drives/${sharedDocumentsId}/root:/Extras/VAGAS EM ABERTO:/children`,
    {
      headers: { Authorization: `Bearer ${response.accessToken}` }
    }
  );
  const files11 = await vagas.json();

  const fileList11 = files11.value.map(file => ({
    name: file.name,
    url: file.webUrl
  }));

  const accerteconnect = await fetch(
    `https://graph.microsoft.com/v1.0/drives/${sharedDocumentsId}/root:/Extras/ACCERTE CONNECT - 2025.1:/children`,
    {
      headers: { Authorization: `Bearer ${response.accessToken}` }
    }
  );
  const files12 = await accerteconnect.json();

  const fileList12 = files12.value.map(file => ({
    name: file.name,
    url: file.webUrl
  }));


  const responseObject = {'politicas': fileList, 'codigos': fileList2, 'processos': fileList3, 'aniversarios': fileList4, 'aniversarioDia': aniversarioDia, 'agenda': fileList5, 'calendario': fileList6, 'compliance':fileList7, 'background':fileList8, 'banners':fileList9, 'docs': fileList10, 'vagas': fileList11, 'accerteconnect': fileList12, 'imageUrl': imageUrl};
  sessionStorage.setItem("sharePoint", JSON.stringify(responseObject));
  return responseObject;    

  }catch (error) {
    console.error("Erro ao obter dados do sharepoint:", error);
    return null;
  }
}

export async function postVagaIndicada(instance, accounts, local, file) {

  try {
    const sharedDocumentsId = "b!xlhstM3P3EaQzU6bGge34Glt-vRamHpMi47-bucH58MDGgu4dgmNSJGRO0nIdQD1";
    
    const response = await getToken(instance, accounts);
    const fileName = encodeURIComponent(file.name);
    const caminho = `Indicações/${local}`; // Caminho completo no SharePoint
    const uploadUrl = `https://graph.microsoft.com/v1.0/drives/${sharedDocumentsId}/root:/${encodeURIComponent(caminho)}/${fileName}:/content`;

    const formData = new FormData();
    formData.append("file", file);

    const insert = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${response.accessToken}`
      },
      body: file,
    });
    const data = await insert.json();
    return data;
  } catch (error) {
    console.error("Erro ao obter dados do sharepoint:", error);
    return null;
  }
}