from sqlalchemy.orm import Session

from .models import Category, Course, Module


def seed_courses(db: Session) -> None:
    if db.query(Course).first():
        return

    vendas = Category(name="Vendas B2B")
    persuasao = Category(name="Persuasão")
    negociacao = Category(name="Negociação")

    db.add_all([vendas, persuasao, negociacao])
    db.flush()

    c1 = Course(
        title="Domine a Prospecção Fria",
        description=(
            "Aprenda técnicas avançadas para abordar clientes corporativos "
            "sem parecer invasivo."
        ),
        duration_text="45 min",
        rating=4.9,
        category_id=vendas.id,
    )
    c1.modules = [
        Module(
            title="O Mindset do Caçador",
            content=(
                "Entenda que a rejeição faz parte do jogo. "
                "O objetivo não é vender no primeiro contato, mas sim vender "
                "a próxima reunião."
            ),
            position=1,
        ),
        Module(
            title="Scripts de Abordagem",
            content=(
                "Use a técnica AIDA (Atenção, Interesse, Desejo, Ação) "
                "para estruturar seus e-mails e mensagens no LinkedIn."
            ),
            position=2,
        ),
        Module(
            title="Follow-up Inteligente",
            content=(
                "Estudos mostram que 80% das vendas acontecem entre o 5º "
                "e o 12º contato. Aprenda a não desistir cedo demais."
            ),
            position=3,
        ),
    ]

    c2 = Course(
        title="Gatilhos Mentais na Prática",
        description=(
            "Como utilizar a escassez, autoridade e prova social para "
            "fechar contratos."
        ),
        duration_text="1h 20m",
        rating=5.0,
        category_id=persuasao.id,
    )
    c2.modules = [
        Module(
            title="Reciprocidade",
            content=(
                "Entregue valor antes de pedir algo em troca. "
                "Um ebook gratuito ou uma análise rápida gera dívida emocional."
            ),
            position=1,
        ),
        Module(
            title="Escassez Real",
            content=(
                "Nunca minta sobre vagas limitadas. Crie escassez real "
                "baseada em tempo (fim do mês) ou bônus exclusivos."
            ),
            position=2,
        ),
        Module(
            title="Prova Social",
            content=(
                "Ninguém quer ser cobaia. Mostre cases de sucesso "
                "parecidos com o cenário do seu cliente atual."
            ),
            position=3,
        ),
    ]

    c3 = Course(
        title="Contornando Objeções",
        description=(
            'O guia definitivo para transformar um "está caro" '
            'em "onde eu assino?".'
        ),
        duration_text="30 min",
        rating=4.8,
        category_id=negociacao.id,
    )
    c3.modules = [
        Module(
            title="Isolando a Objeção",
            content=(
                'Pergunte: "Além do preço, existe mais alguma coisa '
                'que te impede de fechar agora?"'
            ),
            position=1,
        ),
        Module(
            title="Preço vs Valor",
            content=(
                "Preço é o que ele paga, valor é o que ele leva. "
                "Reforce o ROI (Retorno sobre Investimento)."
            ),
            position=2,
        ),
    ]

    db.add_all([c1, c2, c3])
    db.commit()
