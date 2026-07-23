import { LegalPageLayout } from '@/components/legal/legal-page-layout';

export default function PrivacyPolicy() {
    return (
        <LegalPageLayout
            title="Política de Privacidade"
            description="Explicamos de forma simples que dados pessoais tratamos, para que fins e quais são os seus direitos."
        >
            <section>
                <h2>1. Quem é responsável pelos dados</h2>
                <p>
                    A entidade responsável pela exploração da marca Color Fun
                    Parks é responsável pelo tratamento dos dados pessoais
                    recolhidos através deste site e nos seus parques. Pode
                    contactar-nos através dos canais de contacto divulgados no
                    site ou diretamente num dos nossos parques.
                </p>
            </section>

            <section>
                <h2>2. Dados que podemos recolher</h2>
                <p>Consoante a sua interação connosco, podemos tratar:</p>
                <ul>
                    <li>
                        dados de identificação e contacto, como nome, email e
                        telefone;
                    </li>
                    <li>
                        dados do pedido de festa, incluindo parque, programa,
                        nome e idade da criança, data, horário e número de
                        convidados;
                    </li>
                    <li>
                        mensagens, preferências de contacto e histórico do
                        pedido;
                    </li>
                    <li>
                        dados técnicos necessários à segurança e funcionamento
                        do site, como endereço IP, navegador, registos de acesso
                        e cookies.
                    </li>
                </ul>
            </section>

            <section>
                <h2>3. Para que usamos os dados</h2>
                <p>Podemos utilizar os dados pessoais para:</p>
                <ul>
                    <li>
                        responder, analisar e gerir pedidos de marcação e
                        prestar informações solicitadas;
                    </li>
                    <li>
                        confirmar disponibilidade e comunicar alterações
                        relacionadas com uma festa;
                    </li>
                    <li>
                        cumprir obrigações legais, contabilísticas ou
                        administrativas aplicáveis;
                    </li>
                    <li>
                        proteger o site, prevenir abusos e melhorar os nossos
                        serviços;
                    </li>
                    <li>
                        recuperar um pedido não concluído ou enviar comunicações
                        de marketing quando tenha dado consentimento específico
                        para esse fim.
                    </li>
                </ul>
                <p>
                    O tratamento necessário para responder ao seu pedido
                    baseia-se em diligências pré-contratuais solicitadas por si
                    e, quando exista uma marcação confirmada, na execução dessa
                    relação. Outros tratamentos podem basear-se no cumprimento
                    de obrigações legais, em interesses legítimos devidamente
                    ponderados ou no seu consentimento.
                </p>
            </section>

            <section>
                <h2>4. Dados relativos a crianças</h2>
                <p>
                    Os dados sobre crianças devem ser fornecidos pelo respetivo
                    responsável ou por alguém autorizado por este. Recolhemos
                    apenas a informação necessária para organizar e prestar o
                    serviço solicitado.
                </p>
            </section>

            <section>
                <h2>5. Com quem podemos partilhar os dados</h2>
                <p>
                    Os dados podem ser acedidos por trabalhadores autorizados e
                    por prestadores que apoiem o alojamento do site, envio de
                    emails, suporte técnico ou gestão dos pedidos. Estes
                    prestadores apenas podem tratar os dados segundo as nossas
                    instruções e com medidas de segurança adequadas.
                </p>
                <p>
                    Também podemos comunicar dados a autoridades quando tal seja
                    exigido por lei. Não vendemos dados pessoais.
                </p>
            </section>

            <section>
                <h2>6. Transferências internacionais</h2>
                <p>
                    Se um prestador tratar dados fora do Espaço Económico
                    Europeu, asseguraremos a existência de uma decisão de
                    adequação ou de outra garantia legalmente prevista para a
                    transferência.
                </p>
            </section>

            <section>
                <h2>7. Durante quanto tempo conservamos os dados</h2>
                <p>
                    Conservamos os dados apenas durante o período necessário
                    para gerir o pedido ou a marcação, cumprir obrigações legais
                    e resolver eventuais reclamações. Os dados tratados com base
                    em consentimento deixam de ser utilizados para essa
                    finalidade quando retirar o consentimento, sem afetar o
                    tratamento realizado anteriormente.
                </p>
            </section>

            <section>
                <h2>8. Os seus direitos</h2>
                <p>
                    Nos termos aplicáveis, pode pedir o acesso, retificação,
                    apagamento, limitação ou portabilidade dos seus dados e
                    opor-se a determinados tratamentos. Pode ainda retirar um
                    consentimento a qualquer momento.
                </p>
                <p>
                    Para exercer um direito, contacte-nos através dos canais
                    divulgados no site. Poderemos solicitar informação
                    estritamente necessária para confirmar a sua identidade.
                    Pode também apresentar uma reclamação junto da{' '}
                    <a
                        href="https://www.cnpd.pt/"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Comissão Nacional de Proteção de Dados
                    </a>
                    .
                </p>
            </section>

            <section>
                <h2>9. Decisões automatizadas</h2>
                <p>
                    Atualmente não tomamos decisões com efeitos relevantes para
                    si exclusivamente através de tratamento automatizado ou
                    definição de perfis.
                </p>
            </section>

            <section>
                <h2>10. Segurança e alterações</h2>
                <p>
                    Aplicamos medidas técnicas e organizativas destinadas a
                    proteger os dados contra acesso, alteração, perda ou
                    divulgação não autorizados. Podemos atualizar esta política
                    quando os serviços ou requisitos legais se alterem,
                    indicando nesta página a data da versão mais recente.
                </p>
            </section>
        </LegalPageLayout>
    );
}
