import Image from 'next/image'

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="space-y-6">
        <h1 className="text-4xl font-bold tracking-tight">Sobre a IonSphere</h1>
        <p className="text-xl text-muted-foreground">
          Transformando a infraestrutura e cultura de desenvolvimento
        </p>
      </section>

      <div className="mt-16 grid gap-16 lg:grid-cols-2">
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Nossa História</h2>
            <p className="text-muted-foreground">
              A IonSphere nasceu da paixão por tecnologia e da necessidade de
              ajudar empresas a modernizarem suas operações de TI. Desde nossa
              fundação, temos ajudado organizações a adotarem práticas modernas de
              DevOps e Cloud Computing.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Nossa Missão</h2>
            <p className="text-muted-foreground">
              Nossa missão é capacitar empresas a alcançarem excelência
              operacional através da adoção de práticas modernas de DevOps e Cloud
              Computing, fornecendo soluções inovadoras e consultoria
              especializada.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Nossos Valores</h2>
            <ul className="list-inside list-disc space-y-2 text-muted-foreground">
              <li>Inovação contínua</li>
              <li>Excelência técnica</li>
              <li>Transparência e colaboração</li>
              <li>Foco no cliente</li>
              <li>Aprendizado constante</li>
            </ul>
          </div>
        </div>

        <div className="space-y-8">
          <div className="relative aspect-video overflow-hidden rounded-lg">
            <Image
              src="/images/about/team.jpg"
              alt="Time IonSphere"
              fill
              className="object-cover"
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Nossos Serviços</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border bg-card p-4">
                <h3 className="font-medium">Consultoria DevOps</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Transformação cultural e implementação de práticas DevOps
                </p>
              </div>
              <div className="rounded-lg border bg-card p-4">
                <h3 className="font-medium">Cloud Migration</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Migração e otimização de infraestrutura em nuvem
                </p>
              </div>
              <div className="rounded-lg border bg-card p-4">
                <h3 className="font-medium">Automação</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Automação de processos e infraestrutura como código
                </p>
              </div>
              <div className="rounded-lg border bg-card p-4">
                <h3 className="font-medium">Treinamento</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Capacitação técnica em DevOps e Cloud Computing
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Contato</h2>
            <div className="space-y-2 text-muted-foreground">
              <p>Email: contato@ionsphere.com.br</p>
              <p>Telefone: +55 (11) 99999-9999</p>
              <p>Endereço: São Paulo, SP</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 