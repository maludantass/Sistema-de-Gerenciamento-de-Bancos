"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
// Removido Label pois não estava sendo usado e poderia causar erro se o arquivo não existisse
import { Search, Database, FileText, TrendingUp } from "lucide-react"

// --- INTERFACES DE DADOS ---

interface PosicaoFinanceiraDTO {
  id_Cliente: number
  nome_cliente: string
  idConta: number | null
  saldo: number | null
  idServico: number | null
  descricao_servico: string | null
  idContrato: number | null
  valor_contrato: number | null
}

interface AuditoriaContaTransacaoDTO {
  idConta: number
  agencia: string
  numeroConta: string
  idTransacao: number
  dataHoraTransacao: string
}

interface ContaDepositoAlto {
  idConta: number
  agencia: string
  numero: string
  saldo: number
}

// MUDANÇA AQUI: De 'export default function' para 'export function'
export function ConsultasPage() {
  // Estados
  const [activeConsulta, setActiveConsulta] = useState<"auditoria" | "depositos-altos" | "posicao-financeira" | null>(null)
  const [resultados, setResultados] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [valorMinimo, setValorMinimo] = useState<string>("")

  // --- 1. BUSCAR DADOS DA VIEW (POSIÇÃO FINANCEIRA) ---
  const buscarPosicaoFinanceira = async () => {
    setLoading(true)
    console.log("[Consultas] Buscando View de Posição Financeira...")

    try {
      const response = await fetch("http://localhost:8080/api/contas/view/posicao-financeira")
      
      if (response.ok) {
        const data = await response.json()
        setResultados(Array.isArray(data) ? data : [])
        setActiveConsulta("posicao-financeira")

        if (!Array.isArray(data) || data.length === 0) {
          alert("A consulta foi realizada, mas a View não retornou nenhum registro.")
        }
      } else {
        const errorText = await response.text()
        alert(`Erro ao buscar view: ${response.status} - ${errorText}`)
      }
    } catch (error) {
      console.error("[Consultas] Erro de conexão:", error)
      alert("Erro de conexão com o backend. Verifique se o servidor Java está rodando.")
    } finally {
      setLoading(false)
    }
  }

  // --- 2. EXECUTAR AUDITORIA ---
  const executarAuditoria = async () => {
    setLoading(true)
    try {
      const response = await fetch("http://localhost:8080/api/contas/relatorio-auditoria")
      if (response.ok) {
        const data = await response.json()
        setResultados(Array.isArray(data) ? data : [])
        setActiveConsulta("auditoria")
        if (!Array.isArray(data) || data.length === 0) alert("Nenhum dado retornado.")
      } else {
        alert(`Erro: ${response.status}`)
      }
    } catch (error) {
      alert("Erro de conexão.")
    } finally {
      setLoading(false)
    }
  }

  // --- 3. BUSCAR DEPÓSITOS ALTOS ---
  const buscarDepositosAltos = async () => {
    if (!valorMinimo || parseFloat(valorMinimo) <= 0) {
      alert("Informe um valor válido.")
      return
    }
    setLoading(true)
    try {
      const response = await fetch(`http://localhost:8080/api/contas/depositos-acima/${valorMinimo}`)
      if (response.ok) {
        const data = await response.json()
        setResultados(Array.isArray(data) ? data : [])
        setActiveConsulta("depositos-altos")
        if (!Array.isArray(data) || data.length === 0) alert("Nenhum registro encontrado.")
      } else {
        alert(`Erro: ${response.status}`)
      }
    } catch (error) {
      alert("Erro de conexão.")
    } finally {
      setLoading(false)
    }
  }

  // Helpers de Formatação
  const formatCurrency = (value: number | null) => {
    if (value === null || value === undefined) return "—"
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "—"
    try { return new Date(dateString).toLocaleString("pt-BR") } catch { return dateString }
  }

  const resultsExist = (data: any[]) => {
    return Array.isArray(data) && data.length > 0;
  }

  return (
    <div className="space-y-8 p-6 md:p-8">
      {/* Cabeçalho da Página */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Consultas e Views</h1>
        <p className="text-white/80">Central de inteligência de dados: Auditoria, Filtros Avançados e Views SQL</p>
      </div>

      {/* Grid de Cards de Ação */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* CARD 1: AUDITORIA */}
        <Card className="card-shadow border-0 hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="w-5 h-5 text-primary" />
              Auditoria
            </CardTitle>
            <CardDescription>Transações completas das contas</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={executarAuditoria} disabled={loading} className="w-full gap-2" variant="outline">
              <Search className="w-4 h-4" /> Executar Relatório
            </Button>
          </CardContent>
        </Card>

        {/* CARD 2: VIEW POSIÇÃO FINANCEIRA (Destaque) */}
        <Card className="card-shadow border-0 border-t-4 border-t-purple-500 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-purple-700">
              <TrendingUp className="w-5 h-5" />
              Posição Financeira
            </CardTitle>
            <CardDescription>
              View unificada: Clientes + Contas + Serviços
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={buscarPosicaoFinanceira} 
              disabled={loading} 
              className="w-full gap-2 bg-purple-600 hover:bg-purple-700 text-white shadow-sm"
            >
              <Database className="w-4 h-4" /> Carregar View SQL
            </Button>
          </CardContent>
        </Card>

        {/* CARD 3: DEPÓSITOS ALTOS */}
        <Card className="card-shadow border-0 hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Database className="w-5 h-5 text-primary" />
              Depósitos Altos
            </CardTitle>
            <CardDescription>Filtre por saldo mínimo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="number"
              placeholder="Valor Mínimo (R$)"
              value={valorMinimo}
              onChange={(e) => setValorMinimo(e.target.value)}
              className="focus-visible:ring-purple-500"
            />
            <Button onClick={buscarDepositosAltos} disabled={loading || !valorMinimo} className="w-full gap-2">
              <Search className="w-4 h-4" /> Buscar
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Estado de Carregamento */}
      {loading && (
        <div className="flex flex-col items-center justify-center min-h-[200px] space-y-4">
          <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground animate-pulse">Processando consulta no banco de dados...</p>
        </div>
      )}

      {/* Tabela de Resultados */}
      {!loading && activeConsulta && resultsExist(resultados) && (
        <Card className="card-shadow border-0 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CardHeader className="bg-muted/30 border-b">
            <CardTitle className="flex items-center gap-2">
              {activeConsulta === "auditoria" && <FileText className="w-5 h-5" />}
              {activeConsulta === "depositos-altos" && <Database className="w-5 h-5" />}
              {activeConsulta === "posicao-financeira" && <TrendingUp className="w-5 h-5 text-purple-600" />}
              
              {activeConsulta === "auditoria" && "Relatório de Auditoria"}
              {activeConsulta === "depositos-altos" && "Contas com Depósitos Elevados"}
              {activeConsulta === "posicao-financeira" && "View: Posição Financeira Detalhada"}
            </CardTitle>
            <CardDescription>{resultados.length} registros retornados do banco de dados</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-muted-foreground">
                  <tr>
                    {/* CABEÇALHOS DINÂMICOS */}
                    
                    {activeConsulta === "auditoria" && (
                      <>
                        <th className="p-4 text-left font-medium">ID Conta</th>
                        <th className="p-4 text-left font-medium">Agência</th>
                        <th className="p-4 text-left font-medium">Conta</th>
                        <th className="p-4 text-left font-medium">ID Transação</th>
                        <th className="p-4 text-left font-medium">Data</th>
                      </>
                    )}

                    {activeConsulta === "depositos-altos" && (
                      <>
                        <th className="p-4 text-left font-medium">ID Conta</th>
                        <th className="p-4 text-left font-medium">Agência</th>
                        <th className="p-4 text-left font-medium">Número</th>
                        <th className="p-4 text-left font-medium">Saldo</th>
                      </>
                    )}

                    {activeConsulta === "posicao-financeira" && (
                      <>
                        <th className="p-4 text-left font-medium text-purple-900">ID Cliente</th>
                        <th className="p-4 text-left font-medium text-purple-900">Nome Cliente</th>
                        <th className="p-4 text-left font-medium text-purple-900">Dados Bancários</th>
                        <th className="p-4 text-left font-medium text-purple-900">Serviço Contratado</th>
                        <th className="p-4 text-left font-medium text-purple-900">Detalhes Contrato</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  
                  {/* LINHAS DA AUDITORIA */}
                  {activeConsulta === "auditoria" && resultados.map((item: AuditoriaContaTransacaoDTO, i) => (
                    <tr key={i} className="hover:bg-muted/50 transition-colors">
                      <td className="p-4 font-mono text-xs">{item.idConta}</td>
                      <td className="p-4">{item.agencia}</td>
                      <td className="p-4 font-mono">{item.numeroConta}</td>
                      <td className="p-4 text-xs text-muted-foreground">{item.idTransacao}</td>
                      <td className="p-4 text-muted-foreground">{formatDate(item.dataHoraTransacao)}</td>
                    </tr>
                  ))}

                  {/* LINHAS DE DEPÓSITOS ALTOS */}
                  {activeConsulta === "depositos-altos" && resultados.map((conta: ContaDepositoAlto, i) => (
                    <tr key={conta.idConta} className="hover:bg-muted/50 transition-colors">
                      <td className="p-4 font-mono text-xs">{conta.idConta}</td>
                      <td className="p-4">{conta.agencia}</td>
                      <td className="p-4 font-mono">{conta.numero}</td>
                      <td className="p-4 font-bold text-green-600 bg-green-50 w-fit rounded-md">
                        {formatCurrency(conta.saldo)}
                      </td>
                    </tr>
                  ))}

                  {/* LINHAS DA VIEW POSIÇÃO FINANCEIRA */}
                  {activeConsulta === "posicao-financeira" && resultados.map((view: PosicaoFinanceiraDTO, i) => (
                    <tr key={i} className="hover:bg-purple-50/50 transition-colors">
                      <td className="p-4 align-top">
                        <span className="inline-flex items-center justify-center h-6 px-2 rounded-full bg-gray-100 text-gray-600 font-mono text-xs font-bold">
                          #{view.id_Cliente}
                        </span>
                      </td>
                      <td className="p-4 align-top font-medium text-foreground">
                        {view.nome_cliente}
                      </td>
                      <td className="p-4 align-top">
                        {view.idConta ? (
                           <div className="space-y-1">
                             <div className="text-xs text-muted-foreground">Conta ID: {view.idConta}</div>
                             <div className={`text-sm font-semibold ${view.saldo && view.saldo < 0 ? "text-red-500" : "text-green-600"}`}>
                               {formatCurrency(view.saldo)}
                             </div>
                           </div>
                        ) : (
                          <span className="text-muted-foreground text-xs italic">Sem conta</span>
                        )}
                      </td>
                      <td className="p-4 align-top">
                        {view.descricao_servico ? (
                          <span className="inline-block bg-blue-50 text-blue-700 border border-blue-100 px-2 py-1 rounded text-xs font-medium">
                            {view.descricao_servico}
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-xs italic">—</span>
                        )}
                      </td>
                      <td className="p-4 align-top">
                        {view.idContrato ? (
                          <div className="space-y-1">
                             <div className="text-xs text-muted-foreground">Contrato #{view.idContrato}</div>
                             <div className="text-sm">{formatCurrency(view.valor_contrato)}</div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-xs italic">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estado Vazio */}
      {!loading && activeConsulta && !resultsExist(resultados) && (
        <Card className="card-shadow border-0 bg-muted/20">
            <CardContent className="p-12 text-center flex flex-col items-center gap-4">
                <div className="p-4 rounded-full bg-muted">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold">Nenhum resultado encontrado</h3>
                  <p className="text-muted-foreground max-w-sm mx-auto">
                    A consulta foi executada com sucesso, mas não retornou dados para os filtros atuais.
                  </p>
                </div>
            </CardContent>
        </Card>
      )}
    </div>
  )
}