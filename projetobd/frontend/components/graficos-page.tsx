"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { BarChart3, X } from "lucide-react"
import { useState } from "react"

export function GraficosPage() {
    const [selectedGrafico, setSelectedGrafico] = useState<number | null>(null)

    const graficos = Array.from({ length: 14 }, (_, i) => i + 1)

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <BarChart3 className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">Gráficos e Relatórios</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {graficos.map((numero) => (
                    <Card
                        key={numero}
                        className="card-shadow hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => setSelectedGrafico(numero)}
                    >
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

            <Dialog open={selectedGrafico !== null} onOpenChange={(open) => !open && setSelectedGrafico(null)}>
                <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 border-0 bg-transparent">
                    <div className="relative w-full h-full flex items-center justify-center">
                        {/* Close button */}
                        <button
                            onClick={() => setSelectedGrafico(null)}
                            className="absolute top-4 right-4 z-50 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background flex items-center justify-center transition-colors shadow-lg"
                            aria-label="Fechar"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        {/* Image container */}
                        <div className="w-full h-full flex items-center justify-center p-8">
                            <div className="relative w-full max-w-5xl aspect-square bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
                                <div className="text-center">
                                    <BarChart3 className="w-16 h-16 text-muted-foreground/40 mx-auto mb-4" />
                                    <p className="text-lg text-muted-foreground">Gráfico {selectedGrafico}</p>
                                    <p className="text-sm text-muted-foreground/60 mt-2">Adicionar imagem do gráfico aqui</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
