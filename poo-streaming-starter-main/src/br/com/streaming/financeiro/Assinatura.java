package br.com.streaming.financeiro;

// import br.com.streaming.model.Usuario; // Necessário import devido a pacotes diferentes!

public class Assinatura {
    private String dataInicio;
    private double valor;
    private CartaoDeCredito cartao;
    // private Usuario usuario;

    public Assinatura(String dataInicio, double valor) {
        this.dataInicio = dataInicio;
        this.valor = valor;
    }
    // TODO: Gerar Getters, Setters e toString()
}
