import styled from "styled-components";
import HeaderNewComponent from "../components/basic/HeaderNewComponent";

const PowerBIProjetos = () => {

  return (
    <PageContainer>
      <HeaderNewComponent pageTitle={"Dashboard Projetos"} />
      <iframe 
        title="DashProjetosAccerte_operacional" 
        src="https://app.powerbi.com/view?r=eyJrIjoiYzk5YzdjMWItYTU3NC00NTliLWFkMjgtMWI1NmU2ZWMyZDhiIiwidCI6IjU1ZmQwMDdiLWM2ZWYtNDIwZi1iOWY1LTNjODA2ZDNkYWIxMCJ9" 
        style={{ width: "95%", height: "79vh", border: "none" }}
        allowFullScreen
      ></iframe>
    </PageContainer>
  );
};

export default PowerBIProjetos;


const PageContainer = styled.div`
    width: 100%;
    min-height: 100%;
    flex-direction: column;
    align-items: center;
    position: absolute;
    gap: 20px;
    color:rgb(75, 74, 75);
`;
