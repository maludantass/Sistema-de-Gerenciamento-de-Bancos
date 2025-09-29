"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"

export function GraficosPage() {
    // Array para criar 14 placeholders de gráficos
    const graficos = Array.from({ length: 14 }, (_, i) => i + 1)

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <BarChart3 className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">Gráficos e Relatórios</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {graficos.map((numero) => (
                    <Card key={numero} className="card-shadow hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Gráfico {numero}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="aspect-square bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
                                <div className="text-center">
                                    <BarChart3 className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
                                    <p className="text-xs text-muted-foreground">Adicionar gráfico {numero}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
