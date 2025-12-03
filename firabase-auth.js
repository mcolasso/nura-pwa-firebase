import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCeROxrEbhuDM4hS-QOAnK5mEZbC39ZyPI",
    authDomain: "nura-3c4e9.firebaseapp.com",
    projectId: "nura-3c4e9",
    storageBucket: "nura-3c4e9.firebasestorage.app",
    messagingSenderId: "412561169474",
    appId: "1:412561169474:web:be7508b7c01da8a3b6a1db",
    measurementId: "G-LGPRRZQ26C"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Funções Globais expostas para o navegador
window.criarConta = async (nome, email, senha) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
        await updateProfile(userCredential.user, { displayName: nome });
        alert(`Bem-vindo, ${nome}!`);
        window.location.href = "perfil.html";
    } catch (error) {
        alert(tratarErro(error));
    }
};

window.fazerLogin = async (email, senha) => {
    try {
        await signInWithEmailAndPassword(auth, email, senha);
        window.location.href = "perfil.html";
    } catch (error) {
        alert(tratarErro(error));
    }
};

window.fazerLogout = async () => {
    try {
        await signOut(auth);
        window.location.href = "cadastro.html";
    } catch (error) {
        console.error(error);
    }
};

window.verificarAutenticacao = (callback) => {
    onAuthStateChanged(auth, callback);
};

function tratarErro(error) {
    console.error(error);
    if (error.code === 'auth/email-already-in-use') return 'Email já cadastrado.';
    if (error.code === 'auth/invalid-credential') return 'Email ou senha incorretos.';
    if (error.code === 'auth/weak-password') return 'Senha muito fraca (mínimo 6 dígitos).';
    return 'Erro: ' + error.message;
}

console.log("Firebase carregado com sucesso!");