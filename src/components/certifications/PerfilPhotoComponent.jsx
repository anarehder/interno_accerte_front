import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useMsal } from '@azure/msal-react';
import { getToken } from '../../services/graph';

function UserPhotoComponent({ email, nome, url }) {
    const [photoUrl, setPhotoUrl] = useState(null);
    const [error, setError] = useState(false);
    const { instance, accounts } = useMsal();
    const { user } = useAuth();

    
    function getIniciais(nome) {
        const palavras = nome.trim().split(/\s+/); // separa por espaços
        const iniciais = palavras.map(p => p[0].toUpperCase()).join(""); // pega todas as iniciais
        const resultado = iniciais[0] + iniciais[iniciais.length - 1]; // primeira + última
        return resultado;
    }

    useEffect(() => {
        if (!email) return;

        async function fetchPhoto() {
            try {
                const tokenResponse = await getToken(instance, accounts);

                const response = await fetch(`https://graph.microsoft.com/v1.0/users/${email}/photo/$value`, {
                    headers: {
                        Authorization: `Bearer ${tokenResponse.accessToken}`,
                    }
                });

                if (!response.ok) {
                    setError(true);
                    return;
                }

                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                setPhotoUrl(url);
            } catch (err) {
                console.error("Erro ao buscar a foto:", err);
                setError(true);
            }
        }

        fetchPhoto();

        return () => {
            if (photoUrl) {
                URL.revokeObjectURL(photoUrl);
            }
        };
    }, [email]);

    if (photoUrl) {
        if (url) {
            return (
                <a href={url} target="_blank">
                    < img
                        src={photoUrl}
                        alt={`Foto de ${nome}`
                        }
                        style={{
                            width: 60,
                            height: 60,
                            borderRadius: '50%',
                            objectFit: 'cover'
                        }
                        }
                    />
                </a >
            )
        } else {
            return (
                <>
                <img
                    src={photoUrl}
                    alt={`Foto de ${nome}`}
                    style={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        objectFit: 'cover'
                    }}
                />
                </>
            );
        }
    }

    // Fallback com as iniciais
    const iniciais = getIniciais(nome || "");

    if (url) {
        return (
            <a href={url} target="_blank">
                <div
                    style={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        backgroundColor: '#ccc',
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: 48 * 0.4,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textTransform: 'uppercase'
                    }}
                >
                    {iniciais}
                </div>
            </a>
        );
    } else {
        return (
            <div
                style={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    backgroundColor: '#ccc',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: 48 * 0.4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textTransform: 'uppercase'
                }}
            >
                {iniciais}
            </div>
        );
    }
}


export default UserPhotoComponent;