"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { BarChart3, X } from "lucide-react"
import { useState } from "react"

export function GraficosPage() {
  const [selectedGrafico, setSelectedGrafico] = useState<{ url: string; title: string } | null>(null)

  const pesquisa1 = [
    {
      id: 1,
      title: "Dispersão: Saldo Médio x Idade",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gr%C3%A1fico%20disper%C3%A7%C3%A3o%20saldo%20m%C3%A9dio%20x%20idade-CQ1QkUhBfkaeErk6a5ZrbcPI3x1oL4.png",
    },
    {
      id: 2,
      title: "Dispersão: Tipo de Cartão x Bandeira",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gr%C3%A1fico%20disper%C3%A7%C3%A3o%20de%20tipo%20de%20cart%C3%A3o%20x%20bandeira-eJP8rb0rzH6fPMtecfM1CZsgpZ1dFT.png",
    },
    {
      id: 3,
      title: "Quantidade x Saldo Médio",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gr%C3%A1fico%20barra%20quantidade%20x%20saldo%20m%C3%A9dio-5q5OOkqENwvSFGaFZ6VwcYozu7hM2q.png",
    },
    {
      id: 4,
      title: "Tipo da Conta x Quantidade",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gr%C3%A1fico%20barra%20tipo%20da%20conta%20x%20quantidade-rWA0ikWWitJtGPEkxtahDNxwmOWELK.png",
    },
    {
      id: 5,
      title: "Já fez financiamento?",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gr%C3%A1fico%20pizza%20financiamento-eX8P26HSO3JvwsspMPThHOUqwCxVZs.png",
    },
    {
      id: 6,
      title: "Bairro x Número de Bancos",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gr%C3%A1fico%20extra%20bairro%20x%20n%C3%BAmero%20bancos-vS8UCagC6fqY7fPfkklZPiZAaz8sZR.png",
    },
    {
      id: 7,
      title: "Tipo de Cartão",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gr%C3%A1fico%20pizza%20tipo%20cart%C3%A3o-deAaf5zDxGcpgLpy0yAWWraibIWoYD.png",
    },
    {
      id: 8,
      title: "Distribuição por Bancos",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gr%C3%A1fico%20barra%20bancos-B3iHQfE377P4p7wgZBggM0SuPZiZku.png",
    },
  ]

  const pesquisa2 = [
    {
      id: 1,
      title: "Dispersão: Renda x Bairro",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gr%C3%A1fico%20disper%C3%A7%C3%A3o%20renda%20x%20bairro-zSjXD3gt55JycLTo19WAXVq19ZMxBF.png",
    },
    {
      id: 2,
      title: "Dispersão: Tempo com Banco x Percentual que Investe",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gr%C3%A1fico%20disper%C3%A7%C3%A3o%20tempo%20com%20banco%20x%20percentual%20que%20investe-mVqLfuQWBNdLv2NN329oxHWw5N4arl.png",
    },
    {
      id: 3,
      title: "Dispersão: Idade x Produtos",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gr%C3%A1fico%20disper%C3%A7%C3%A3o%20idade%20x%20produtos-XwUeDtCdzE5v8K10b16XheatBI8oAW.png",
    },
    {
      id: 4,
      title: "Origem da Renda x Quantidade",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gr%C3%A1fico%20barra%20origem%20da%20renda%20x%20quantidade-hAGtFjjnNshN5ZM61X37Ctj9w79Ish.png",
    },
    {
      id: 5,
      title: "Percentual da Renda Investido",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gr%C3%A1fico%20barra%20percentual%20da%20renda%20investido-lC9JUdU37VpsGMPk0VgAC57RdG6aMd.png",
    },
    {
      id: 6,
      title: "Tipos de Investimento",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gr%C3%A1fico%20pizza%20de%20Investimento-HDdXfNrm4eaWXUusPEWioUgUa6LyKN.png",
    },
    {
      id: 7,
      title: "Dispersão: Renda Mensal x Quanto Investe",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gr%C3%A1fico%20disper%C3%A7%C3%A3o%20renda%20mensal%20x%20quanto%20investe-kSpGaWPfM1TCwZVabrbFwXAsxronYE.png",
    },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <BarChart3 className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">Gráficos e Relatórios</h2>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground">Pesquisa 1</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {pesquisa1.map((grafico) => (
            <Card
              key={grafico.id}
              className="card-shadow hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
              onClick={() => setSelectedGrafico({ url: grafico.url, title: grafico.title })}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">{grafico.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-square rounded-lg overflow-hidden bg-white">
                  <img
                    src={grafico.url || "/placeholder.svg"}
                    alt={grafico.title}
                    className="w-full h-full object-contain"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground">Pesquisa 2</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {pesquisa2.map((grafico) => (
            <Card
              key={grafico.id}
              className="card-shadow hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
              onClick={() => setSelectedGrafico({ url: grafico.url, title: grafico.title })}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">{grafico.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-square rounded-lg overflow-hidden bg-white">
                  <img
                    src={grafico.url || "/placeholder.svg"}
                    alt={grafico.title}
                    className="w-full h-full object-contain"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={selectedGrafico !== null} onOpenChange={(open) => !open && setSelectedGrafico(null)}>
        <DialogContent className="max-w-[98vw] max-h-[98vh] p-0 border-0 bg-black/90 backdrop-blur-md">
          <div className="relative w-full h-full flex items-center justify-center min-h-[98vh]">
            <button
              onClick={() => setSelectedGrafico(null)}
              className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-colors shadow-lg"
              aria-label="Fechar"
            >
              <X className="w-5 h-5 text-black" />
            </button>

            <div className="w-full h-full flex items-center justify-center p-8">
              {selectedGrafico && (
                <img
                  src={selectedGrafico.url || "/placeholder.svg"}
                  alt={selectedGrafico.title}
                  className="object-contain"
                  style={{ width: "60vw", height: "60vh" }}
                />
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
