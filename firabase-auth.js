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
    apiKey: "AIzaSyBoSeMo0JROnkjtNPQXCyt9Ezzi_pUrtN8",
    authDomain: "nura-firebase-aula24112025.firebaseapp.com",
    projectId: "nura-firebase-aula24112025",
    storageBucket: "nura-firebase-aula24112025.firebasestorage.app",
    messagingSenderId: "622140430264",
    appId: "1:622140430264:web:5622fe037075fbe723614d"
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