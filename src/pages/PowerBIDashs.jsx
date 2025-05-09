import React from "react";
import styled from "styled-components";

const PowerBIDashs = () => {

  return (
    <Container>
      <Title>Dashboards do Power BI</Title>
      {/* <iframe title="Dash Marketing" width="1140" height="541.25" src="https://app.powerbi.com/reportEmbed?reportId=81c72f67-5a46-4a20-b741-487f9fef3d8e&autoAuth=true&ctid=55fd007b-c6ef-420f-b9f5-3c806d3dab10" frameborder="0" allowFullScreen="true"></iframe> */}
      <a href="https://app.powerbi.com/reportEmbed?reportId=81c72f67-5a46-4a20-b741-487f9fef3d8e&autoAuth=true&ctid=55fd007b-c6ef-420f-b9f5-3c806d3dab10" />
    </Container>
  );
};

export default PowerBIDashs;


const Container = styled.div`
  padding: 2rem;
  font-family: "Segoe UI", sans-serif;
  background-color: #f5f7fa;
  min-height: 100vh;
`;

const Title = styled.h2`
  color: #202940;
  margin-bottom: 1rem;
`;