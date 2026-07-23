import { LegalPageLayout } from '@/components/legal/legal-page-layout';

export default function TermsAndConditions() {
    return (
        <LegalPageLayout
            title="Termos e Condições"
            description="Estes termos regulam a utilização do site e o envio de pedidos de marcação de festas."
        >
            <section>
                <h2>1. Âmbito</h2>
                <p>
                    O site Color Fun Parks permite consultar informação sobre os
                    nossos parques e enviar pedidos de marcação de festas. Ao
                    utilizar o site, compromete-se a fazê-lo de forma lícita e a
                    respeitar estes termos.
                </p>
            </section>

            <section>
                <h2>2. Natureza do pedido de marcação</h2>
                <p>
                    O envio do formulário representa um pedido de marcação e não
                    uma confirmação automática da festa. A data, horário,
                    programa e restantes condições só ficam confirmados após
                    validação expressa pela nossa equipa.
                </p>
            </section>

            <section>
                <h2>3. Informação fornecida pelo utilizador</h2>
                <p>
                    Deve fornecer informação verdadeira, atual e suficiente para
                    podermos analisar o pedido. O pedido deve ser apresentado
                    por uma pessoa maior de idade e autorizada a fornecer os
                    dados das crianças e restantes participantes envolvidos.
                </p>
                <p>
                    Se os dados estiverem incorretos ou incompletos, poderemos
                    solicitar esclarecimentos antes de continuar a análise.
                </p>
            </section>

            <section>
                <h2>4. Disponibilidade e confirmação</h2>
                <p>
                    A disponibilidade apresentada ou solicitada pode alterar-se
                    até à confirmação final. Quando a opção pretendida não
                    estiver disponível, podemos propor outra data, horário,
                    parque ou programa. O utilizador é livre de aceitar ou
                    recusar a alternativa.
                </p>
            </section>

            <section>
                <h2>5. Alterações e cancelamentos</h2>
                <p>
                    As condições concretas de alteração, cancelamento,
                    capacidade, eventuais valores e outros elementos comerciais
                    serão comunicados antes da confirmação definitiva da
                    marcação. Essas condições não prejudicam os direitos
                    imperativos reconhecidos ao consumidor pela legislação
                    aplicável.
                </p>
            </section>

            <section>
                <h2>6. Regras dos parques e segurança</h2>
                <p>
                    Os participantes devem respeitar as indicações da equipa, as
                    regras de utilização dos equipamentos e as normas de
                    segurança aplicáveis em cada parque. O responsável pela
                    marcação deve comunicar antecipadamente informação relevante
                    para a segurança e organização da atividade.
                </p>
            </section>

            <section>
                <h2>7. Comunicações</h2>
                <p>
                    As comunicações relacionadas com o pedido podem ser
                    realizadas através do email, telefone ou área de cliente
                    indicados para o efeito. O utilizador deve manter os seus
                    contactos atualizados e verificar as mensagens relativas ao
                    pedido.
                </p>
            </section>

            <section>
                <h2>8. Dados pessoais</h2>
                <p>
                    O tratamento de dados pessoais associado ao site e aos
                    pedidos de marcação encontra-se descrito na nossa Política
                    de Privacidade.
                </p>
            </section>

            <section>
                <h2>9. Conteúdos e propriedade intelectual</h2>
                <p>
                    Os textos, imagens, marcas, logótipos e restantes conteúdos
                    do site estão protegidos pelos direitos aplicáveis. Não
                    podem ser copiados, alterados ou utilizados para fins
                    comerciais sem autorização prévia, salvo nos casos
                    permitidos por lei.
                </p>
            </section>

            <section>
                <h2>10. Disponibilidade do site e responsabilidade</h2>
                <p>
                    Procuramos manter o site seguro, correto e disponível, mas
                    podem ocorrer interrupções técnicas ou erros temporários.
                    Nada nestes termos exclui ou limita responsabilidade quando
                    essa exclusão ou limitação não seja permitida por lei.
                </p>
            </section>

            <section>
                <h2>11. Reclamações e resolução de conflitos</h2>
                <p>
                    Em caso de dúvida ou reclamação, contacte-nos primeiro
                    através dos canais divulgados no site. Pode também utilizar
                    o{' '}
                    <a
                        href="https://www.livroreclamacoes.pt/Inicio/"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Livro de Reclamações Eletrónico
                    </a>{' '}
                    e recorrer aos meios de resolução de conflitos de consumo
                    legalmente disponíveis.
                </p>
            </section>

            <section>
                <h2>12. Lei aplicável e alterações</h2>
                <p>
                    Estes termos são regidos pela lei portuguesa, sem prejuízo
                    das normas imperativas de proteção do consumidor. Podemos
                    atualizar os termos para refletir alterações do serviço ou
                    da legislação, publicando nesta página a versão mais
                    recente.
                </p>
            </section>
        </LegalPageLayout>
    );
}
