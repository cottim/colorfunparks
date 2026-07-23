import { LegalPageLayout } from '@/components/legal/legal-page-layout';

export default function CookiePolicy() {
    return (
        <LegalPageLayout
            title="Política de Cookies"
            description="Saiba que tecnologias de armazenamento utilizamos e como pode gerir as suas preferências."
        >
            <section>
                <h2>1. O que são cookies</h2>
                <p>
                    Cookies são pequenos ficheiros guardados no dispositivo
                    quando visita um site. Permitem, por exemplo, manter uma
                    sessão segura, recordar preferências ou compreender como o
                    site é utilizado.
                </p>
                <p>
                    O armazenamento local do navegador, como o{' '}
                    <span lang="en">localStorage</span>, tem uma função
                    semelhante para determinadas preferências e rascunhos. Nesta
                    política, referimo-nos em conjunto a estas tecnologias como
                    armazenamento no dispositivo.
                </p>
            </section>

            <section>
                <h2>2. Tecnologias utilizadas atualmente</h2>
                <ul>
                    <li>
                        <strong>Cookies estritamente necessários:</strong>{' '}
                        suportam a segurança, proteção contra pedidos
                        fraudulentos, autenticação e funcionamento técnico do
                        site.
                    </li>
                    <li>
                        <strong>Preferências de apresentação:</strong> permitem
                        recordar opções como o tema visual escolhido pelo
                        utilizador.
                    </li>
                    <li>
                        <strong>Armazenamento de rascunhos:</strong> o
                        formulário de marcação poderá guardar localmente o
                        progresso para que não se perca após uma atualização ou
                        interrupção de ligação. Quando esta funcionalidade for
                        ativada, o prazo de conservação e a forma de eliminar o
                        rascunho serão indicados ao utilizador.
                    </li>
                </ul>
            </section>

            <section>
                <h2>3. Cookies opcionais</h2>
                <p>
                    Atualmente, o site não utiliza cookies de analítica,
                    publicidade ou personalização de terceiros. Se viermos a
                    introduzir essas tecnologias, esta política e o gestor de
                    consentimento serão atualizados antes da sua ativação.
                </p>
                <p>
                    Cookies opcionais não serão instalados antes de uma escolha
                    positiva do utilizador. A recusa não impede o acesso às
                    funcionalidades essenciais do site.
                </p>
            </section>

            <section>
                <h2>4. Duração</h2>
                <p>
                    Alguns cookies são eliminados quando fecha o navegador;
                    outros permanecem durante um período limitado para recordar
                    uma preferência ou manter a segurança da conta. A duração
                    depende da finalidade de cada tecnologia e é revista
                    periodicamente.
                </p>
            </section>

            <section>
                <h2>5. Como gerir ou eliminar cookies</h2>
                <p>
                    Pode eliminar ou bloquear cookies nas definições do seu
                    navegador. A desativação de cookies estritamente necessários
                    pode impedir o início de sessão ou o funcionamento correto
                    de algumas áreas.
                </p>
                <p>
                    Quando existirem cookies opcionais, poderá alterar a sua
                    escolha através do gestor de preferências disponibilizado no
                    site, com a mesma facilidade com que deu o consentimento.
                </p>
            </section>

            <section>
                <h2>6. Dados pessoais e contactos</h2>
                <p>
                    Quando a informação recolhida através destas tecnologias
                    permita identificar uma pessoa, aplica-se também a nossa
                    Política de Privacidade. Para esclarecer dúvidas ou exercer
                    direitos, utilize os canais de contacto divulgados no site.
                </p>
            </section>

            <section>
                <h2>7. Alterações a esta política</h2>
                <p>
                    Podemos atualizar esta política quando introduzirmos novas
                    tecnologias ou alterarmos a forma como o site funciona. A
                    data da versão mais recente estará sempre indicada no topo
                    da página.
                </p>
            </section>
        </LegalPageLayout>
    );
}
