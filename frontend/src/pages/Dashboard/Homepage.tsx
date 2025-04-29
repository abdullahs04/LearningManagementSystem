import React from 'react';
import { useNavigate } from 'react-router-dom';

const Homepage: React.FC = () => {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/signin');
    };

    return (
        <>
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>Welcome to the Learning Management System</h1>
                <p style={styles.subtitle}>
                    Your gateway to seamless learning and management.
                </p>
                <button style={styles.button} onClick={handleLogin}>
                    Sign in
                </button>
                </div>
            </div>
        </>
    );
};

const styles = {
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#e9ecef',
        padding: '1rem',
    },
    card: {
        textAlign: 'center' as const,
        backgroundColor: '#fff',
        padding: '2rem',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        maxWidth: '400px',
        width: '100%',
    },
    title: {
        fontSize: '2rem',
        fontWeight: 'bold' as const,
        marginBottom: '1rem',
        color: '#343a40',
    },
    subtitle: {
        fontSize: '1rem',
        marginBottom: '2rem',
        color: '#6c757d',
    },
    button: {
        padding: '0.75rem 1.5rem',
        fontSize: '1rem',
        cursor: 'pointer',
        border: 'none',
        borderRadius: '5px',
        backgroundColor: '#007bff',
        color: '#fff',
        transition: 'background-color 0.3s ease',
    },
    buttonHover: {
        backgroundColor: '#0056b3',
    },
};

export default Homepage;