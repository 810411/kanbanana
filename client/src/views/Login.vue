<template>
    <v-container>
        <v-row class="my-6"
               align="center"
               justify="center">
            <v-col class="mt-6" cols="12" sm="8" lg="6" xl="4">
                <v-form ref="loginForm"
                        v-model="valid"
                        lazy-validation
                        @submit.prevent="onLogin">
                    <v-card class="elevation-12">
                        <v-toolbar flat>
                            <v-toolbar-title>
                                <span v-if="createUser">Welcome! {{createUser.message}}</span>
                                <span v-else>Welcome back! </span>
                            </v-toolbar-title>
                        </v-toolbar>
                        <v-divider></v-divider>
                        <v-card-text>
                            <v-text-field v-model="email"
                                          :rules="emailRules"
                                          required
                                          clearable
                                          label="Email"
                                          name="email"
                                          prepend-icon="email"
                                          type="text">
                            </v-text-field>
                            <v-text-field v-model="password"
                                          :rules="passwordRules"
                                          required
                                          clearable
                                          label="Password"
                                          name="password"
                                          prepend-icon="lock"
                                          type="password">
                            </v-text-field>
                        </v-card-text>
                        <v-card-actions>
                            <div class="flex-grow-1"></div>
                            <v-btn large
                                   :loading="loading"
                                   type="submit">
                                <span class="mx-5">Login</span>
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-form>
            </v-col>
        </v-row>
        <v-row xs="12">
            <v-col class="text-center">
                <router-link to="/register">Not a member - register now</router-link>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
  import {onLogin} from '../vue-apollo'
  import {LOGIN} from "../graphql/mutations";
  export default {
    name: "Login",
    props: {
      createUser: Object
    },
    computed: {
      user: function () {
        return this.$store.state.user
      }
    },
    watch: {
      user: function(newUser) {
        if (newUser) {
          this.$router.push('/projects')
        }
      }
    },
    data() {
      return {
        valid: true,
        loading: false,
        email: this.createUser && this.createUser.email || null,
        emailRules: [
          v => !!v || 'E-mail is required',
          v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
        ],
        password: null,
        passwordRules: [
          v => !!v || 'Password is required',
          v => (v && v.length >= 8) || 'Password must be at least 8 characters',
        ],
      }
    },
    methods: {
      async onLogin() {
        if (this.$refs.loginForm.validate()) {
          this.loading = true;
          try {
            const {data, errors} = await this.$apollo.mutate({
              mutation: LOGIN,
              variables: {
                email: this.email,
                password: this.password
              }
            });
            const {login} = data;
            await onLogin(this.$apollo.provider.defaultClient, data.login.token);
            this.$store.commit('setUser', login.user);
            if (errors) {
              throw new Error(errors[0])
            }
          } catch (error) {
            this.$store.commit('setError', error);
            console.error(error)
          }
          this.loading = false;
        }
      }
    }
  }
</script>

<style scoped>

</style>
