"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, Database, FileText } from "lucide-react"

interface AuditoriaDTO {
  numeroConta: string
  agencia: string
  saldoConta: number
  valorTransacao: number
  dataTransacao: string
  tipoTransacao: string
}

export function ConsultasPage() {
  const [activeConsulta, setActiveConsulta] = useState<"auditoria" | "depositos-altos" | null>(null)
  const [resultados, setResultados] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [valorMinimo, setValorMinimo] = useState<string>("")

  const executarAuditoria = async () => {
    setLoading(true)
    try {
      const response = await fetch("http://localhost:8080/api/contas/relatorio-auditoria")
      if (response.ok) {
        const data = await response.json()
        setResultados(data)
        setActiveConsulta("auditoria")
      } else {
        alert("Erro ao executar auditoria.")
      }
    } catch (error) {
      alert("Erro de conexão.")
    } finally {
      setLoading(false)
    }
  }

  const buscarDepositosAltos = async () => {
    if (!valorMinimo) {
      alert("Por favor, informe o valor mínimo.")
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`http://localhost:8080/api/contas/depositos-acima-de/${valorMinimo}`)
      if (response.ok) {
        const data = await response.json()
        setResultados(data)
        setActiveConsulta("depositos-altos")
      } else {
        alert("Erro ao buscar depósitos.")
      }
    } catch (error) {
      alert("Erro de conexão.")
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("pt-BR")
  }

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Consultas e Views</h1>
        <p className="text-white/80">Execute consultas avançadas no banco de dados</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="card-shadow border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Relatório de Auditoria
            </CardTitle>
            <CardDescription>
              Visualize todas as transações (depósitos e saques) com informações completas das contas (FULL OUTER JOIN)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={executarAuditoria} disabled={loading} className="w-full gap-2">
              <Search className="w-4 h-4" />
              Executar Auditoria
            </Button>
          </CardContent>
        </Card>

        <Card className="card-shadow border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Depósitos Acima de Valor
            </CardTitle>
            <CardDescription>
              Busque contas com depósitos acima de um valor específico (Subconsulta Correlacionada)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="valorMinimo">Valor Mínimo (R$)</Label>
              <Input
                id="valorMinimo"
                type="number"
                step="0.01"
                value={valorMinimo}
                onChange={(e) => setValorMinimo(e.target.value)}
                placeholder="Ex: 1000.00"
              />
            </div>
            <Button onClick={buscarDepositosAltos} disabled={loading} className="w-full gap-2">
              <Search className="w-4 h-4" />
              Buscar Depósitos
            </Button>
          </CardContent>
        </Card>
      </div>

      {loading && (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-center space-y-4">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-muted-foreground">Executando consulta...</p>
          </div>
        </div>
      )}

      {!loading && activeConsulta && resultados.length > 0 && (
        <Card className="card-shadow border-0">
          <CardHeader>
            <CardTitle>
              {activeConsulta === "auditoria" && "Resultados da Auditoria"}
              {activeConsulta === "depositos-altos" && "Contas com Depósitos Elevados"}
            </CardTitle>
            <CardDescription>{resultados.length} registros encontrados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50 border-b">
                    {activeConsulta === "auditoria" && (
                      <>
                        <th className="p-4 text-left text-sm font-semibold">Número Conta</th>
                        <th className="p-4 text-left text-sm font-semibold">Agência</th>
                        <th className="p-4 text-left text-sm font-semibold">Saldo</th>
                        <th className="p-4 text-left text-sm font-semibold">Valor Transação</th>
                        <th className="p-4 text-left text-sm font-semibold">Data</th>
                        <th className="p-4 text-left text-sm font-semibold">Tipo</th>
                      </>
                    )}
                    {activeConsulta === "depositos-altos" && (
                      <>
                        <th className="p-4 text-left text-sm font-semibold">ID Conta</th>
                        <th className="p-4 text-left text-sm font-semibold">Agência</th>
                        <th className="p-4 text-left text-sm font-semibold">Número</th>
                        <th className="p-4 text-left text-sm font-semibold">Saldo</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {activeConsulta === "auditoria" &&
                    resultados.map((item: AuditoriaDTO, index) => (
                      <tr
                        key={index}
                        className={`border-b hover:bg-muted/30 transition-colors ${
                          index % 2 === 0 ? "bg-background" : "bg-muted/10"
                        }`}
                      >
                        <td className="p-4">{item.numeroConta || "—"}</td>
                        <td className="p-4">{item.agencia || "—"}</td>
                        <td className="p-4">{item.saldoConta ? formatCurrency(item.saldoConta) : "—"}</td>
                        <td className="p-4">{item.valorTransacao ? formatCurrency(item.valorTransacao) : "—"}</td>
                        <td className="p-4 text-sm">{item.dataTransacao ? formatDate(item.dataTransacao) : "—"}</td>
                        <td className="p-4">
                          {item.tipoTransacao && (
                            <span
                              className={`px-2 py-1 rounded-md text-xs font-medium ${
                                item.tipoTransacao === "Depósito"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {item.tipoTransacao}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}

                  {activeConsulta === "depositos-altos" &&
                    resultados.map((conta: any, index) => (
                      <tr
                        key={conta.idConta}
                        className={`border-b hover:bg-muted/30 transition-colors ${
                          index % 2 === 0 ? "bg-background" : "bg-muted/10"
                        }`}
                      >
                        <td className="p-4">{conta.idConta}</td>
                        <td className="p-4">{conta.agencia}</td>
                        <td className="p-4 font-mono text-sm">{conta.numero}</td>
                        <td className="p-4 font-semibold text-green-600">{formatCurrency(conta.saldo)}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {!loading && activeConsulta && resultados.length === 0 && (
        <Card className="card-shadow border-0">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Nenhum resultado encontrado</h3>
            <p className="text-muted-foreground">Tente ajustar os parâmetros da consulta</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
