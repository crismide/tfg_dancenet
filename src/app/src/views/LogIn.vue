<template>
    <div class="main-div">
        <BotonAtras/>
        <div class="elementos_verticales espaciado_centrado">
            <div class="logo"></div>
            <div class="centrado">
                <form @submit.prevent="handleLogInForm">
                    <input type="text" v-model="user.email" placeholder="Correo electrónico" class="form_login"/><br><br>
                    <input type="password" class="form_login" v-model="user.password" placeholder="Contraseña"/><br><br><br><br>
                    <button type="submit" class="button_entrar">Entrar</button>
                </form>
                <p>{{ error }}</p>
            </div>
            
        </div>
        
    </div>
</template>

<script>
import axios from "axios";
import BotonAtras from '../components/BotonAtras.vue'

export default{
    name: "LogIn",
    components: {BotonAtras},
    data() {
        return {
            user: {
                email: '',
                password: ''
            },
            error:'error'
        }
    },
    methods: {
        handleLogInForm() {
            let apiURL = `http://localhost:4000/login`;

            axios.post(apiURL, this.user)
            .then((response) => {

                if (response.data.status === true) {
                const userId = response.data.userId;
                this.$router.push(`/inicio/${userId}`);
                this.user = {
                    email: '',
                    password: ''
                };}
            })
            .catch(error => {
                console.log(error);
                this.error = error
            });
        }
    }
}
</script>

<style>

.logo{
  background-size: cover;
  background-image: url("../assets/logo_dancenet.png");
  width: 120px;
  height: 120px;
}

.espaciado_centrado{
    gap: 76px;
    align-items: center;
}

.form_login{
    width: 286px;   
    height: 64px;
    background: #F4F4F4;
    border-radius: 5px;
    color: #7C7C7C;
    font-size: 16px;
    
}

.button_entrar{
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 15px, 91px, 15px, 91px;
    gap: 10px;
    border: 0px;
    width: 286px;
    height: 58px;
    
    border-radius: 25px;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 600;
    font-size: 20px;
    line-height: 24px;
    color: #FFFFFF;
    background: #C286F1;
}

::placeholder{
    padding: 19px;
}
</style>