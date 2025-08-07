import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { Link } from "react-router-dom";
import HeaderNewComponent from '../components/basic/HeaderNewComponent';
import CertificacoesListComponent from '../components/certifications/CertificacoesListComponent';

function CertificationsPage() {
    const { user } = useAuth();

    return (
        <PageContainer>
            <HeaderNewComponent pageTitle={"Certificações"}/>
            {
                (user?.mail === 'maria.silva@accerte.com.br' || user?.mail === 'ana.rehder@accerte.com.br'|| user?.mail === 'daniel.garcia@accerte.com.br') && <AdminButton><Link to="/certificacoes/admin">Painel Admin</Link></AdminButton>
            }
            <CertificacoesListComponent />
        </PageContainer>
    )
}

export default CertificationsPage;

const PageContainer = styled.div`
    width: 100%;
    height: 100%;
    min-height: 101vh;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    color: rgb(75, 74, 75);
`

const AdminButton = styled.button`
    top: 20px;
    right: 250px;
    position: absolute;
    width: 150px;
    font-size: 16px;
    justify-content: center;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    background-color: white;
    border: 2px solid #003289;
    color: #003289;
    &:hover {
        background-color: #003289;
        color: white;
    }
`;
