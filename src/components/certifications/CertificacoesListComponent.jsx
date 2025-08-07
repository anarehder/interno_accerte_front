import styled from 'styled-components';
import { useEffect, useState } from 'react';
import apiService from '../../services/apiService';
import apiServiceCertificacoes from '../../services/apiServiceCertificacoes';
import { useAuth } from '../../contexts/AuthContext';
import CertificacoesCardComponent from './CertificacoesCardComponent';
import UserPhotoComponent from './PerfilPhotoComponent';
import { FaCrown } from "react-icons/fa";


function CertificacoesListComponent() {
    const { user } = useAuth();
    const [selectedLevel, setSelectedLevel] = useState("");
    const [niveis, setNiveis] = useState([]);
    const [allowed, setAllowed] = useState(false);
    const [emissores, setEmissores] = useState([]);
    const [selectedEmissor, setSelectedEmissor] = useState("");
    const [certifications, setCertifications] = useState([]);
    const [filteredCertifications, setFilteredCertifications] = useState([]);
    const [top3Geral, setTop3Geral] = useState([]);

    // console.log(user);
    useEffect(() => {
        if (!user) return;
        const fetchData = async () => {
            const body = { email: user.mail };
            try {
                const response2 = await apiServiceCertificacoes.buscarNivel(body);
                setNiveis(response2.data);
            } catch (error) {
                console.error("Erro ao buscar informacoes de niveis:", error);
            }
            try {
                const response = await apiServiceCertificacoes.buscarEmissor(body);
                setEmissores(response.data);
            } catch (error) {
                console.error("Erro ao buscar informacoes de emissores:", error);
            }
            try {
                const response = await apiServiceCertificacoes.buscarCertificacao(body);
                setCertifications(response.data);
            } catch (error) {
                console.error("Erro ao buscar informacoes de certificações:", error);
            }
            try {
                const response = await apiServiceCertificacoes.buscarListaCertsNiveis(body);
                // console.log(response.data);
                const top3 = response.data
                    .sort((a, b) => b['Total'] - a['Total']) // ordena do maior para o menor
                    .slice(0, 3);
                setTop3Geral(top3);
            } catch (error) {
                console.error("Erro ao buscar informacoes de certificações:", error);
            }
            
        };

        fetchData();

    }, [user]);

    useEffect(() => {
            if (!user) return;
            const fetchGestores = async () => {
                try {
                    const response = await apiService.buscarGestoresInfo();
                    const gestorConf = response.data.filter(item => item.Funcionarios?.email?.toLowerCase() == user.mail?.toLowerCase());
                    if (gestorConf.length>0){
                        setAllowed(true);
                    } else if (user.mail === 'daniel.garcia@accerte.com.br'){
                        setAllowed(true);
                    }
                } catch (error) {
                    console.error("Erro ao buscar informacoes de gestores:", error);
                }
            };
    
            fetchGestores();
    
    }, [user]);


    const handleSelectEmissor = (e) => {
        const selectedId = e.target.value;
        setSelectedEmissor(selectedId);
        setSelectedLevel("");
        setFilteredCertifications([]);
    };

    const handleSelectLevel = (nivel) => {
        setSelectedLevel(nivel);
        if (selectedLevel === "Extra") {
            const filteredEmissor = certifications.filter(cert => cert.emissorId === Number(selectedEmissor));
            const filtered = filteredEmissor.filter(cert => cert.nivelId === null);

            setFilteredCertifications(filtered);
        } else {
        // Filtra os certificados com base no emissor selecionado
            const filteredEmissor = certifications.filter(cert => cert.emissorId === Number(selectedEmissor));
            const filtered = filteredEmissor.filter(cert => cert.nivelId === nivel.id);

            setFilteredCertifications(filtered);
        }
    };

    return (
        <PageContainer>
            <Top3Block>
                <h2>TOP 3 GERAL</h2>
                {top3Geral?.length > 0 &&
                    top3Geral.map((t, index) => (
                        <Block key={index}>
                        <Imagem > 
                            <h2>{index+1}º</h2>
                            <FaCrown size={24} style={{ transform: 'rotate(-25deg)',color: '#d1b217', position: 'absolute', top: '-18px' }}/>
                            <UserPhotoComponent email={t.email} nome={t.nome} />
                        </Imagem>
                        <p>{t.nome}</p>
                        </Block>
                    ))}
            </Top3Block>
            <CentralizedDiv>
                    <Label>Emissor/Área:</Label>
                    <select onChange={handleSelectEmissor}>
                        <option value="">Selecione...</option>
                        {emissores.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.nome}
                            </option>
                        ))}
                    </select>
            </CentralizedDiv>
            <CentralizedDiv>
                {niveis.length > 0 &&
                niveis.map((n, index) => (
                        <NivelButton key={index} $color={selectedLevel === n ? "yes" : "no"} onClick={()=>handleSelectLevel(n)}>Nível {n.nivel}</NivelButton>
                    ))}
                <NivelButton $color={selectedLevel === 'Extra' ? "yes" : "no"} onClick={()=>handleSelectLevel("Extra")}>Extra</NivelButton>
            </CentralizedDiv>
            <div>
                {selectedLevel?.valor &&
                    <ValorButton>VALOR DE BONIFICAÇÃO | {Number(selectedLevel?.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</ValorButton>
                }
                {selectedLevel === "Extra" &&
                    <ValorButton>SEM BONIFICAÇÃO | FORA DO PCA</ValorButton>
                }
            </div>
            {/* se selectedEmissor for '' nao mostro nada e tiver emissor uso o filtro */}
            <CentralizedColumnDiv>
                {filteredCertifications.length > 0  ? 
                filteredCertifications.map((c) => (
                    <CertificacoesCardComponent key={c.id} certificacao={c} allowed={allowed} />
                )):
                selectedLevel !== "" &&
                <Label>
                    Sem certificações para exibir.
                </Label>
                }
            </CentralizedColumnDiv>
            {filteredCertifications.length > 0 && selectedLevel !== "Extra" &&
            <>
            <br/>
            <p> <strong>Ativa PCA: apta para receber bonificação.</strong></p>
            <p><strong>Bloqueada: certificações novas não estarão incluídas no PCA, apenas renovações.</strong></p>
            <br/>
            </>
            }
        </PageContainer>
    )
}

export default CertificacoesListComponent;

const PageContainer = styled.div`
    width: 80%;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 15px;
    font-size: 25px;
    margin-bottom: 20px;
    gap: 30px;
    margin: 0 auto;    
`

const CentralizedDiv = styled.div`
    margin: 0 auto;
    justify-content: center;
`

const CentralizedColumnDiv = styled.div`
    margin: 0 auto;
    justify-content: center;
    flex-direction: column;
    gap: 30px;
`

const Label = styled.label`
    display: block;
    font-size: 20px;
    display: flex;
    margin-right: 15px;
    justify-content: center;
    // background-color: red;
    height: 45px;
    align-items: center;
`;

const NivelButton = styled.div`
    width: 100px;
    height: 40px;
    color: ${({ $color }) => ($color  === 'yes' ? "#0046ba" : "white")};
    background-color: ${({ $color }) => ($color  === 'yes' ? "white" : "#0046ba")};
    font-weight: 700;
    border-radius: 15px;
    font-size: 20px;
    justify-content: center;
    align-items: center;
    margin: 0 10px;
    box-shadow: 0px 4px 4px 0px #00000040;
`

const ValorButton = styled.div`
    width: 400px;
    height: 40px;
    background-color: white;
    color: #0046ba;
    font-weight: 500;
    border-radius: 15px;
    font-size: 20px;
    justify-content: center;
    align-items: center;
    margin: 0 10px;
    box-shadow: 0px 4px 4px 0px #00000040;
    margin: 0 auto;
`

const Value = styled.div`
    font-size: 14px;
    color: #555;
    margin-bottom: 10px;
    flex-direction: column;
    max-width: 100px;
    background-color: red;
    align-items: center;
    p{
        margin-top: 10px;
        font-size: 14px;
        text-align: left;
    }
`;

const Imagem = styled.div`
    position: relative;
    width: 100px;
    align-items: center;
    justify-content: center;
    gap: 20px;
`

const Top3Block = styled.div`
    position: fixed;
    background-color: white;
    justify-content: center;
    align-items: center;
    gap: 25px;
    top: 20px;
    right: 50px;
    flex-direction: column;
    min-height: 200px;
    width: 140px;
    border: 1px solid gray;
    padding: 8px 15px;
    border-radius: 30px;
    z-index: 10;
    p{
        font-size: 14px;
    }
`

const Block = styled.div`
    // background-color: red;
    align-items: center;
    flex-direction: column;
    gap: 5px;
    margin-bottom: 5px;
`