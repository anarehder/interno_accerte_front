import styled from 'styled-components';
import HeaderGGComponent from '../components/HeaderGGComponent';
import { useAuth } from '../contexts/AuthContext';
import { Link } from "react-router-dom";

function ScalePage() {
    const { user } = useAuth();

    // function getWeekRange(date) {
    //     const monday = startOfWeek(date, { weekStartsOn: 1 });
    //     const friday = addDays(monday, 4);
    //     return {
    //       start: format(monday, "dd/MM/yyyy", { locale: ptBR }),
    //       end: format(friday, "dd/MM/yyyy", { locale: ptBR }),
    //     };
    // }

    //     const today = new Date();
    //     const weekRanges = [];
      
    //     // Semana atual
    //     weekRanges.push(getWeekRange(today));
      
    //     // Se hoje for sexta (5), sábado (6) ou domingo (0), adiciona próxima semana
    //     if (isFriday(today) || isSaturday(today) || isSunday(today)) {
    //       const nextWeek = addDays(today, 7);
    //       weekRanges.push(getWeekRange(nextWeek));
    // }

    return (
        <PageContainer>
            <HeaderGGComponent pageTitle={"Escala Semanal"} />
            {
                (user?.mail === 'maria.silva@accerte.com.br' || user?.mail === 'ana.rehder@accerte.com.br') && <AdminButton><Link to="/admin">Painel Admin</Link></AdminButton>
            }
            {/* <div className="flex flex-col gap-2">
                {weekRanges.map((range, index) => (
                    <button key={index} className="px-4 py-2 bg-blue-600 text-white rounded">
                        de {range.start} até {range.end}
                    </button>
                ))}
            </div> */}
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
`

const AdminButton = styled.button`
    top: 2%;
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
