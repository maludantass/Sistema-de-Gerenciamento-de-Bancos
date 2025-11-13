"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, CreditCard, TrendingUp, TrendingDown, DollarSign, Activity } from "lucide-react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"

interface DashboardStats {
  totalFuncionarios: number
  totalContas: number
  totalDepositos: number
  totalSaques: number
  saldoTotal: number
  mediaDepositos: number
  mediaSaques: number
  mediaSaldoContas: number
  varianciaDepositos: number
  desvioPadraoDepositos: number
  medianaSaldos: number
  modaSaldos: number
  distribuicaoSaldos: { faixa: string; quantidade: number }[]
  distribuicaoDepositos: { faixa: string; frequencia: number }[]
  contas: any[]
  depositos: any[]
  saques: any[]
}

const fetchDashboardData = async (): Promise<DashboardStats> => {
  try {
    console.log("[v0] Buscando dados do backend...")

    // Buscar funcionários
    const funcResponse = await fetch("http://localhost:8080/api/funcionarios")
    const funcionarios = funcResponse.ok ? await funcResponse.json() : []

    // Buscar contas
    const contasResponse = await fetch("http://localhost:8080/api/contas")
    const contas = contasResponse.ok ? await contasResponse.json() : []

    // Buscar depósitos
    const depResponse = await fetch("http://localhost:8080/api/depositos")
    const depositos = depResponse.ok ? await depResponse.json() : []

    // Buscar saques
    const saqResponse = await fetch("http://localhost:8080/api/saques")
    const saques = saqResponse.ok ? await saqResponse.json() : []

    console.log("[v0] Dados recebidos:", {
      funcionarios: funcionarios.length,
      contas: contas.length,
      depositos: depositos.length,
      saques: saques.length,
    })

    // Calcular estatísticas dos dados reais
    const totalFuncionarios = funcionarios.length
    const totalContas = contas.length
    const totalDepositos = depositos.length
    const totalSaques = saques.length

    const saldoTotal = contas.reduce((sum: number, conta: any) => sum + (conta.saldo || 0), 0)
    const mediaSaldoContas = totalContas > 0 ? saldoTotal / totalContas : 0

    const somaDepositos = depositos.reduce((sum: number, dep: any) => sum + (dep.valor || 0), 0)
    const mediaDepositos = totalDepositos > 0 ? somaDepositos / totalDepositos : 0

    const somaSaques = saques.reduce((sum: number, saq: any) => sum + (saq.valor || 0), 0)
    const mediaSaques = totalSaques > 0 ? somaSaques / totalSaques : 0

    // Calcular variância e desvio padrão dos depósitos
    const varianciaDepositos =
      totalDepositos > 0
        ? depositos.reduce((sum: number, dep: any) => {
            return sum + Math.pow((dep.valor || 0) - mediaDepositos, 2)
          }, 0) / totalDepositos
        : 0

    const desvioPadraoDepositos = Math.sqrt(varianciaDepositos)

    // Calcular mediana dos saldos
    const saldosOrdenados = contas.map((c: any) => c.saldo || 0).sort((a: number, b: number) => a - b)
    const medianaSaldos = totalContas > 0 ? saldosOrdenados[Math.floor(totalContas / 2)] : 0

    // Calcular moda (valor mais frequente)
    const saldosCount: { [key: number]: number } = {}
    saldosOrdenados.forEach((saldo: number) => {
      const roundedSaldo = Math.round(saldo / 1000) * 1000 // Arredondar para milhares
      saldosCount[roundedSaldo] = (saldosCount[roundedSaldo] || 0) + 1
    })
    const modaSaldos = Object.keys(saldosCount).reduce(
      (a, b) => (saldosCount[Number(a)] > saldosCount[Number(b)] ? a : b),
      "0",
    )

    const distribuicaoSaldos = [
      { faixa: "0-1K", quantidade: contas.filter((c: any) => c.saldo >= 0 && c.saldo < 1000).length },
      { faixa: "1K-3K", quantidade: contas.filter((c: any) => c.saldo >= 1000 && c.saldo < 3000).length },
      { faixa: "3K-5K", quantidade: contas.filter((c: any) => c.saldo >= 3000 && c.saldo < 5000).length },
      { faixa: "5K+", quantidade: contas.filter((c: any) => c.saldo >= 5000).length },
    ]

    const distribuicaoDepositos = [
      { faixa: "0-500", frequencia: depositos.filter((d: any) => d.valor >= 0 && d.valor < 500).length },
      { faixa: "500-800", frequencia: depositos.filter((d: any) => d.valor >= 500 && d.valor < 800).length },
      { faixa: "800-1000", frequencia: depositos.filter((d: any) => d.valor >= 800 && d.valor < 1000).length },
      { faixa: "1000+", frequencia: depositos.filter((d: any) => d.valor >= 1000).length },
    ]

    return {
      totalFuncionarios,
      totalContas,
      totalDepositos,
      totalSaques,
      saldoTotal,
      mediaDepositos,
      mediaSaques,
      mediaSaldoContas,
      varianciaDepositos,
      desvioPadraoDepositos,
      medianaSaldos,
      modaSaldos: Number(modaSaldos),
      distribuicaoSaldos,
      distribuicaoDepositos,
      contas,
      depositos,
      saques,
    }
  } catch (error) {
    console.error("[v0] Erro ao buscar dados do dashboard:", error)
    throw error
  }
}

export function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchDashboardData()
      setStats(data)
    } catch (err) {
      setError("Erro ao carregar dados. Verifique se o backend está rodando em http://localhost:8080")
      console.error(err)
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Carregando dados do banco de dados...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Erro ao Conectar ao Backend</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{error}</p>
            <button
              onClick={loadDashboardData}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
            >
              Tentar Novamente
            </button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!stats) return null

  const getTendenciasMensais = () => {
    const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]
    const tendencias = meses
      .map((mes, index) => {
        const depositosDoMes = stats.depositos.filter((d: any) => {
          const data = new Date(d.data_transacao)
          return data.getMonth() === index
        }).length

        const saquesDoMes = stats.saques.filter((s: any) => {
          const data = new Date(s.data_transacao)
          return data.getMonth() === index
        }).length

        return { mes, depositos: depositosDoMes, saques: saquesDoMes }
      })
      .filter((t) => t.depositos > 0 || t.saques > 0) // Mostrar apenas meses com dados

    // Se não houver dados mensais, mostrar resumo geral
    if (tendencias.length === 0) {
      return [{ mes: "Total", depositos: stats.totalDepositos, saques: stats.totalSaques }]
    }

    return tendencias
  }

  const getCorrelacaoTransacoes = () => {
    // Agrupar por semanas dos últimos 30 dias
    const agora = new Date()
    const semanas = []

    for (let i = 3; i >= 0; i--) {
      const inicioSemana = new Date(agora)
      inicioSemana.setDate(agora.getDate() - (i * 7 + 7))
      const fimSemana = new Date(agora)
      fimSemana.setDate(agora.getDate() - i * 7)

      const depositosDaSemana = stats.depositos.filter((d: any) => {
        const data = new Date(d.data_transacao)
        return data >= inicioSemana && data < fimSemana
      }).length

      const saquesDaSemana = stats.saques.filter((s: any) => {
        const data = new Date(s.data_transacao)
        return data >= inicioSemana && data < fimSemana
      }).length

      semanas.push({
        periodo: `Sem ${4 - i}`,
        depositos: depositosDaSemana,
        saques: saquesDaSemana,
      })
    }

    return semanas
  }

  const barChartData = [
    { name: "Funcionários", value: stats.totalFuncionarios },
    { name: "Contas", value: stats.totalContas },
    { name: "Depósitos", value: stats.totalDepositos },
    { name: "Saques", value: stats.totalSaques },
  ]

  const pieChartData = [
    { name: "Depósitos", value: stats.totalDepositos },
    { name: "Saques", value: stats.totalSaques },
  ]

  const tendenciasMensais = getTendenciasMensais()
  const correlacaoTransacoes = getCorrelacaoTransacoes()

  // Statistical comparison
  const radarData = [
    { metrica: "Funcionários", valor: Math.min((stats.totalFuncionarios / 100) * 100, 100), maximo: 100 },
    { metrica: "Contas", valor: Math.min((stats.totalContas / 100) * 100, 100), maximo: 100 },
    { metrica: "Depósitos", valor: Math.min((stats.totalDepositos / 50) * 100, 100), maximo: 100 },
    { metrica: "Saques", valor: Math.min((stats.totalSaques / 50) * 100, 100), maximo: 100 },
    { metrica: "Saldo Médio", valor: Math.min((stats.mediaSaldoContas / 5000) * 100, 100), maximo: 100 },
  ]

  const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"]

  return (
    <div className="space-y-8">
      <div className="gradient-primary rounded-xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Dashboard Estatístico</h1>
        <p className="text-white/80">Análise em tempo real dos dados do banco de dados PostgreSQL</p>
      </div>

      {/* Indicadores Resumidos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card-shadow border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Funcionários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFuncionarios}</div>
            <p className="text-xs text-muted-foreground">Cadastrados no sistema</p>
          </CardContent>
        </Card>

        <Card className="card-shadow border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Contas</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalContas}</div>
            <p className="text-xs text-muted-foreground">Contas bancárias ativas</p>
          </CardContent>
        </Card>

        <Card className="card-shadow border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.saldoTotal)}</div>
            <p className="text-xs text-muted-foreground">Em todas as contas</p>
          </CardContent>
        </Card>

        <Card className="card-shadow border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média de Saldo</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.mediaSaldoContas)}</div>
            <p className="text-xs text-muted-foreground">Mediana: {formatCurrency(stats.medianaSaldos)}</p>
          </CardContent>
        </Card>

        <Card className="card-shadow border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Depósitos</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{stats.totalDepositos}</div>
            <p className="text-xs text-muted-foreground">Média: {formatCurrency(stats.mediaDepositos)}</p>
          </CardContent>
        </Card>

        <Card className="card-shadow border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Saques</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.totalSaques}</div>
            <p className="text-xs text-muted-foreground">Média: {formatCurrency(stats.mediaSaques)}</p>
          </CardContent>
        </Card>
      </div>

      {/* 6 Gráficos Estatísticos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Gráfico de Barras - Visão Geral */}
        <Card className="card-shadow border-0">
          <CardHeader>
            <CardTitle>1. Visão Geral do Sistema</CardTitle>
            <CardDescription>Distribuição de registros por categoria (dados do BD)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 2. Gráfico de Pizza - Depósitos vs Saques */}
        <Card className="card-shadow border-0">
          <CardHeader>
            <CardTitle>2. Proporção de Transações</CardTitle>
            <CardDescription>Comparativo entre depósitos e saques (dados reais)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 3. Gráfico de Linha - Tendências Temporais */}
        <Card className="card-shadow border-0">
          <CardHeader>
            <CardTitle>3. Tendências Temporais</CardTitle>
            <CardDescription>Evolução de transações por período (calculado do BD)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={tendenciasMensais}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="depositos" stroke="hsl(var(--chart-1))" strokeWidth={2} />
                <Line type="monotone" dataKey="saques" stroke="hsl(var(--chart-2))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 4. Gráfico Radar - Métricas Multidimensionais */}
        <Card className="card-shadow border-0">
          <CardHeader>
            <CardTitle>4. Análise Multidimensional</CardTitle>
            <CardDescription>Comparação de métricas do sistema (dados reais)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metrica" />
                <PolarRadiusAxis />
                <Radar
                  name="Percentual"
                  dataKey="valor"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.6}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 5. Gráfico de Barras - Distribuição de Frequência */}
        <Card className="card-shadow border-0">
          <CardHeader>
            <CardTitle>5. Distribuição de Saldos</CardTitle>
            <CardDescription>Frequência de contas por faixa de saldo (calculado do BD)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.distribuicaoSaldos}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="faixa" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="quantidade" fill="hsl(var(--chart-3))" name="Quantidade de Contas" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 6. Gráfico de Linha - Correlação de Transações */}
        <Card className="card-shadow border-0">
          <CardHeader>
            <CardTitle>6. Correlação de Transações</CardTitle>
            <CardDescription>Relação entre depósitos e saques por semana (dados reais)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={correlacaoTransacoes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="periodo" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="depositos" stroke="hsl(var(--chart-1))" strokeWidth={2} />
                <Line type="monotone" dataKey="saques" stroke="hsl(var(--chart-2))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Estatísticas Avançadas - Medidas de Tendência Central e Dispersão */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="card-shadow border-0">
          <CardHeader>
            <CardTitle>Medidas de Tendência Central</CardTitle>
            <CardDescription>Análise estatística dos saldos (calculado do BD)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Média:</span>
              <span className="font-semibold">{formatCurrency(stats.mediaSaldoContas)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Mediana:</span>
              <span className="font-semibold">{formatCurrency(stats.medianaSaldos)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Moda:</span>
              <span className="font-semibold">{formatCurrency(stats.modaSaldos)}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="card-shadow border-0">
          <CardHeader>
            <CardTitle>Medidas de Dispersão</CardTitle>
            <CardDescription>Variabilidade dos depósitos (calculado do BD)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Variância:</span>
              <span className="font-semibold">{stats.varianciaDepositos.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Desvio Padrão:</span>
              <span className="font-semibold">{formatCurrency(stats.desvioPadraoDepositos)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Coef. Variação:</span>
              <span className="font-semibold">
                {stats.mediaDepositos > 0 ? ((stats.desvioPadraoDepositos / stats.mediaDepositos) * 100).toFixed(2) : 0}
                %
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="card-shadow border-0">
          <CardHeader>
            <CardTitle>Percentuais e Taxas</CardTitle>
            <CardDescription>Indicadores de performance (dados reais)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Taxa Depósito/Conta:</span>
              <span className="font-semibold text-success">
                {stats.totalContas > 0 ? (stats.totalDepositos / stats.totalContas).toFixed(2) : 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Taxa Saque/Conta:</span>
              <span className="font-semibold text-destructive">
                {stats.totalContas > 0 ? (stats.totalSaques / stats.totalContas).toFixed(2) : 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Saldo/Funcionário:</span>
              <span className="font-semibold">
                {stats.totalFuncionarios > 0
                  ? formatCurrency(stats.saldoTotal / stats.totalFuncionarios)
                  : formatCurrency(0)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
