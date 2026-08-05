package br.com.streaming.main;

// Importando a classe Usuario do pacote model
import br.com.streaming.model.Usuario;

public class MainTeste {
    public static void main(String[] args) {
        System.out.println("=== SISTEMA DE STREAMING ===");

        // Criando dois usuários com os mesmos dados
        Usuario u1 = new Usuario("gustavomarangoni461@gmail.com", "Gustavo Marangoni");
        Usuario u2 = new Usuario("gustavomarangoni461@gmail.com", "Gustavo Marangoni");

        u1.setNome("Gustavo Marangoni");
        u1.setEmail("gustavomarangoni461@gmail.com");

        u2.setNome("Gustavo Marangoni");
        u2.setEmail("gustavomarangoni461@gmail.com");

        // Verificando duplicidade com a comparação de referência
        if (u1 == u2) {
            System.out.println("Erro: Usuário já existe!");
        } else {
            System.out.println("Cadastro liberado!");
        }

        // Imprimindo os usuários
        System.out.println(u1);
        System.out.println(u2);
    }
}