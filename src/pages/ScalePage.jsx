import styled from 'styled-components';
import HeaderGGComponent from '../components/HeaderGGComponent';
import { useAuth } from '../contexts/AuthContext';
import { Link } from "react-router-dom";
import ScaleTableComponent from '../components/ScaleTableComponent';

function ScalePage() {
    const { user } = useAuth();
    
    return (
        <PageContainer>
            <HeaderGGComponent pageTitle={"Escala Semanal"} />
            {
                (user?.mail === 'maria.silva@accerte.com.br' || user?.mail === 'ana.rehder@accerte.com.br') && <AdminButton><Link to="/admin">Painel Admin</Link></AdminButton>
            }
            <ScaleTableComponent />
        </PageContainer>
    )
}

export default ScalePage;

const PageContainer = styled.div`
    width: 100%;
    height: 100%;
    min-height: 100vh;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    margin-bottom: 35px;
    position: relative;
    color:rgb(75, 74, 75);
`

const AdminButton = styled.button`
    top: 20px;
    right: 2%;
    position: absolute;
    font-size: 16px;
    justify-content: center;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    background-color: #ED1F4C;
    color: white;
    &:hover {
        background-color: #ED1F4C;
    }
`;
