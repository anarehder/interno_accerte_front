// SugestoesComponent.jsx
import { useEffect, useState } from 'react';
import styled from "styled-components";
import AprovarFerias from '../../assets/painel-gestores/aprovar-ferias.png';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/apiService';
import { FaCheck } from "react-icons/fa";
import { MdBlock } from "react-icons/md";
import HeaderImageComponent from '../../components/basic/HeaderImageComponent';

function AprovarFeriasPage() {
    //buscar a lista dos items que o tipo nao aprovou, se for Rh ou Gestor
    const type = "Gestor";
    const { user } = useAuth();
    const [ferias, setFerias] = useState([]);
    const [updated, setUpdated] = useState(false);
    const [carregando, setCarregando] = useState(true);
    useEffect(() => {
        if (!user) return;
        const fetchScale = async () => {
            try {
                const body = { adminEmail: user.mail };
                const response = await apiService.buscarFeriasGestor(body);
                setFerias(response.data);
                setCarregando(false);
                setUpdated(false);
            } catch (error) {
                // setErrorMessage(error.response.data.message);
                console.error(error);
                setCarregando(false);
            }
        };
        fetchScale();

    }, [user, updated]);

    function formatarDataBR(dataIso) {
        const data = new Date(dataIso);
        const [ano, mes, dia] = data.toISOString().slice(0, 10).split("-");
        return `${dia}/${mes}/${ano}`;
    }

    // Heurística por palavra-chave: cobre os status de férias (Aprovado/Reprovado/Concluído/Solicitado...).
    function getStatusStyle(status) {
        const s = (status || '').toLowerCase();
        if (s.includes('reprovado')) return { bg: '#fdecea', color: '#c0392b', border: '#c0392b' };
        if (s.includes('conclu')) return { bg: '#eef1f4', color: '#5b6b79', border: '#9aa7b2' };
        if (s.includes('aprovado')) return { bg: '#e8f8ef', color: '#1e8e5a', border: '#1e8e5a' };
        return { bg: '#fff8e6', color: '#b8860b', border: '#d4a017' }; // pendente/solicitado/outros
    }

    async function handleApprove(id, status){
        const body = {email: user.mail, id: id, status: status, tipo: type};
        try {
            const response = await apiService.approveVacation(body);
            if(response.status === 200 ) {
                setUpdated(true);
            } else {
                setUpdated(false);
            }
        } catch (error) {
            setErrorMessage(error.response.data.message);
            setCarregando(false);
        }
    };


    return (
        <PageContainer>
            <HeaderImageComponent pageTitle={"Aprovar"} subtitle={"Férias"} lastPage={"painelgestores"} image={AprovarFerias} />
            <Container>
                <h2>Férias Solicitadas</h2>
                {ferias.length !== 0 &&
                    < VacationTable >
                        <div>
                            <p><span>Nome</span></p>
                            <p><span>Início</span></p>
                            <p><span>Fim</span></p>
                            <p><span>Dias</span></p>
                            <p><span>Referente Início</span></p>
                            <p><span>Referente Fim</span></p>
                            <p><span>Status</span></p>
                            <p><span>Aprovar</span></p>
                            <p><span>Reprovar</span></p>
                        </div>
                        {ferias
                            ?.filter((d) => !d.status.includes("Reprovado"))
                            .map((d, i) => {
                                const statusStyle = getStatusStyle(d.status);
                                return (
                                    <div key={i}>
                                        <p>{d.Funcionarios.nome} {d.Funcionarios.sobrenome}</p>
                                        <p>{formatarDataBR(d.inicio)}</p>
                                        <p>{formatarDataBR(d.fim)}</p>
                                        <p>{d.totalDias}</p>
                                        <p>{formatarDataBR(d.referenteInicio)}</p>
                                        <p>{formatarDataBR(d.referenteFim)}</p>
                                        <p>
                                            <Tag $bg={statusStyle.bg} $color={statusStyle.color} $border={statusStyle.border}>
                                                {d.status}
                                            </Tag>
                                        </p>
                                        <p>
                                            <ActionButton $variant="approve" onClick={() => handleApprove(d.id, true)} title="Aprovar">
                                                <FaCheck />
                                            </ActionButton>
                                        </p>
                                        <p>
                                            {!d.status.includes("Reprovado")
                                                ? <ActionButton $variant="reject" onClick={() => handleApprove(d.id, false)} title="Reprovar">
                                                    <MdBlock />
                                                </ActionButton>
                                                : <ActionButton $variant="disabled" disabled title="Já reprovado">
                                                    <MdBlock />
                                                </ActionButton>
                                            }
                                        </p>
                                    </div>
                                );
                            })}
                    </VacationTable>
                }
                {ferias.length === 0 && !carregando && <h2>Sem férias pra exibir.</h2>}
            </Container >
        </PageContainer>
    );
};

export default AprovarFeriasPage;

const PageContainer = styled.div`
    width: 100%;
    min-height: 100%;
    flex-direction: column;
    align-items: center;
    position: absolute;
    gap: 20px;
    color:rgb(75, 74, 75);
`

const Container = styled.div`
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    gap: 10px;
    color: #555;
    border: none;
    h2 {
        margin: 20px 0;
    }
}
`

const VacationTable = styled.div` 
    width: 92%; 
    margin-top: 20px;
    margin-bottom: 30px;
    flex-direction: column;
    justify-content: space-between;
    gap: 10px;
    color: #0057E1;
    margin-bottom: 50px;
    div {
        align-items: center;
        justify-content: center;
        gap: 10px;
        height: 45px;
        padding-bottom: 7px;
        border-bottom: 1px solid #80808F;
        p{
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 2px 0;
            width: 15%;
            line-height: 22px;
            
        }
        p:nth-child(1)){
            width: 25%;
        }
        p:nth-child(4){
            width: 8%;
        }
        p:nth-child(7){
            width: 12%;
        }
        p:nth-child(8){
            width: 8%;
        }
        p:nth-child(9){
            width: 8%;
        }
    }
    span{
        font-weight: 600;
    }
`

const Tag = styled.span`
    display: inline-flex;
    padding: 5px 14px;
    font-size: 13px;
    font-weight: 700;
    border-radius: 999px;
    border: 1px solid ${({ $border }) => $border};
    color: ${({ $color }) => $color};
    background: ${({ $bg }) => $bg};
    white-space: nowrap;
`

const ACTION_VARIANTS = {
    approve: { color: '#1e8e5a', bg: '#e8f8ef', hoverBg: '#1e8e5a' },
    reject: { color: '#c0392b', bg: '#fdecea', hoverBg: '#c0392b' },
    disabled: { color: '#9aa7b2', bg: '#eef1f4', hoverBg: '#eef1f4' },
};

const ActionButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    border: 1px solid ${({ $variant }) => ACTION_VARIANTS[$variant].color};
    background: ${({ $variant }) => ACTION_VARIANTS[$variant].bg};
    color: ${({ $variant }) => ACTION_VARIANTS[$variant].color};
    cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
    transition: 0.2s;
    padding: 0;

    svg {
        font-size: 16px;
    }

    &:hover {
        background: ${({ $variant, disabled }) => (disabled ? ACTION_VARIANTS[$variant].bg : ACTION_VARIANTS[$variant].hoverBg)};
        color: ${({ disabled }) => (disabled ? 'inherit' : '#fff')};
    }
`