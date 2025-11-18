"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Filter, CreditCard, Building2, DollarSign } from "lucide-react"

interface Conta {
  idConta: number
  agencia: string
  numero: string
  saldo: number
  id_Cliente?: number
}

interface ParContasAgenciaDTO {
  agencia: string
  numeroConta1: string
  numeroConta2: string
}

export function ContasPage() {
  const [contas, setContas] = useState<Conta[]>([])
  const [paresContas, setParesContas] = useState<ParContasAgenciaDTO[]>([])
  const [contasFiltradas, setContasFiltradas] = useState<Conta[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingConta, setEditingConta] = useState<Conta | null>(null)
  const [activeFilter, setActiveFilter] = useState<"todos" | "pares-agencia" | "faixa-saldo" | "busca-individual">(
    "todos",
  )

  const [saldoMin, setSaldoMin] = useState<string>("")
  const [saldoMax, setSaldoMax] = useState<string>("")

  const [searchNumero, setSearchNumero] = useState<string>("")
  const [searchId, setSearchId] = useState<string>("")
  const [contaEncontrada, setContaEncontrada] = useState<Conta | null>(null)

  const [formData, setFormData] = useState<Conta>({
    idConta: 0,
    agencia: "",
    numero: "",
    saldo: 0,
    id_Cliente: undefined,
  })

  useEffect(() => {
    fetchContas()
  }, [])

  const fetchContas = async () => {
    try {
      console.log("[v0] Buscando contas...")
      const response = await fetch("http://localhost:8080/api/contas")
      console.log("[v0] Response status:", response.status)

      if (response.ok) {
        const data = await response.json()
        console.log("[v0] Dados recebidos:", data)
        setContas(data)
      } else {
        console.log("[v0] Erro na resposta:", response.statusText)
        alert("Erro ao carregar contas. Verifique se o backend está rodando.")
      }
    } catch (error) {
      console.log("[v0] Erro de conexão:", error)
      alert("Erro de conexão. Verifique se o backend está rodando na porta 8080.")
    } finally {
      setLoading(false)
    }
  }

  const fetchParesContas = async () => {
    try {
      setLoading(true)
      console.log("[v0] Buscando pares de contas por agência...")
      const response = await fetch("http://localhost:8080/api/contas/pares-por-agencia")

      if (response.ok) {
        const data = await response.json()
        console.log("[v0] Pares de contas:", data)
        setParesContas(data)
        setActiveFilter("pares-agencia")
      } else {
        alert("Erro ao carregar pares de contas.")
      }
    } catch (error) {
      console.log("[v0] Erro:", error)
      alert("Erro de conexão.")
    } finally {
      setLoading(false)
    }
  }

  const fetchContasPorSaldo = async () => {
    if (!saldoMin || !saldoMax) {
      alert("Por favor, preencha os valores mínimo e máximo do saldo.")
      return
    }

    try {
      setLoading(true)
      console.log("[v0] Buscando contas por faixa de saldo...")
      const response = await fetch(`http://localhost:8080/api/contas/buscar-por-saldo?min=${saldoMin}&max=${saldoMax}`)

      if (response.ok) {
        const data = await response.json()
        console.log("[v0] Contas por saldo:", data)
        setContasFiltradas(data)
        setActiveFilter("faixa-saldo")
      } else {
        alert("Erro ao buscar contas por saldo.")
      }
    } catch (error) {
      console.log("[v0] Erro:", error)
      alert("Erro de conexão.")
    } finally {
      setLoading(false)
    }
  }

  const showAllContas = () => {
    setActiveFilter("todos")
    fetchContas()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    console.log("[v0] Iniciando salvamento de conta...")
    console.log("[v0] Dados do formulário:", formData)
    console.log("[v0] Editando conta:", editingConta)

    const dataToSend = {
      ...formData,
      id_Cliente: formData.id_Cliente || null,
    }

    console.log("[v0] Dados a enviar:", dataToSend)

    try {
      const url = editingConta
        ? `http://localhost:8080/api/contas/${editingConta.idConta}`
        : "http://localhost:8080/api/contas"

      const method = editingConta ? "PUT" : "POST"

      console.log("[v0] URL:", url)
      console.log("[v0] Método:", method)
      console.log("[v0] Payload:", JSON.stringify(dataToSend))

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      })

      console.log("[v0] Response status:", response.status)
      console.log("[v0] Response headers:", response.headers)

      if (response.ok) {
        const responseData = await response.text()
        console.log("[v0] Response data:", responseData)
        alert(`Conta ${editingConta ? "atualizada" : "criada"} com sucesso!`)
        fetchContas()
        resetForm()
      } else {
        const errorText = await response.text()
        console.log("[v0] Erro na resposta:", errorText)
        alert(`Erro ao salvar conta. Status: ${response.status}. Erro: ${errorText}`)
      }
    } catch (error) {
      console.log("[v0] Erro de conexão:", error)
      alert("Erro de conexão com o servidor.")
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir esta conta?")) return

    try {
      console.log("[v0] Excluindo conta ID:", id)
      const response = await fetch(`http://localhost:8080/api/contas/${id}`, {
        method: "DELETE",
      })

      console.log("[v0] Delete response status:", response.status)

      if (response.ok) {
        alert("Conta excluída com sucesso!")
        fetchContas()
      } else {
        const errorText = await response.text()
        console.log("[v0] Erro ao excluir:", errorText)
        alert(`Erro ao excluir conta. Status: ${response.status}`)
      }
    } catch (error) {
      console.log("[v0] Erro de conexão ao excluir:", error)
      alert("Erro de conexão com o servidor.")
    }
  }

  const resetForm = () => {
    setFormData({
      idConta: 0,
      agencia: "",
      numero: "",
      saldo: 0,
      id_Cliente: undefined,
    })
    setEditingConta(null)
    setShowForm(false)
  }

  const openEditForm = (conta: Conta) => {
    setEditingConta(conta)
    setFormData(conta)
    setShowForm(true)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const totalBalance = contas.reduce((sum, conta) => sum + conta.saldo, 0)

  const buscarPorNumero = async () => {
    if (!searchNumero.trim()) {
      alert("Por favor, digite um número de conta para buscar.")
      return
    }

    try {
      setLoading(true)
      console.log("[v0] Buscando conta por número:", searchNumero)
      const response = await fetch(`http://localhost:8080/api/contas/numero/${encodeURIComponent(searchNumero)}`)

      if (response.ok) {
        const data = await response.json()
        console.log("[v0] Conta encontrada:", data)
        if (data) {
          setContaEncontrada(data)
          setActiveFilter("busca-individual")
        } else {
          alert("Nenhuma conta encontrada com esse número.")
        }
      } else if (response.status === 404) {
        alert("Conta não encontrada com esse número.")
      } else {
        alert("Erro ao buscar conta por número.")
      }
    } catch (error) {
      console.log("[v0] Erro:", error)
      alert("Erro de conexão.")
    } finally {
      setLoading(false)
    }
  }

  const buscarPorId = async () => {
    if (!searchId.trim()) {
      alert("Por favor, digite um ID para buscar.")
      return
    }

    try {
      setLoading(true)
      console.log("[v0] Buscando conta por ID:", searchId)
      const response = await fetch(`http://localhost:8080/api/contas/${searchId}`)

      if (response.ok) {
        const data = await response.json()
        console.log("[v0] Conta encontrada:", data)
        setContaEncontrada(data)
        setActiveFilter("busca-individual")
      } else if (response.status === 404) {
        alert("Conta não encontrada com esse ID.")
      } else {
        alert("Erro ao buscar conta por ID.")
      }
    } catch (error) {
      console.log("[v0] Erro:", error)
      alert("Erro de conexão.")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Carregando contas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="gradient-accent rounded-xl p-8 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Contas Bancárias</h1>
            <p className="text-white/80">Gerencie as contas do sistema</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{formatCurrency(totalBalance)}</div>
            <div className="text-white/80 text-sm">Saldo total</div>
          </div>
        </div>
      </div>

      <Card className="card-shadow border-0">
        <CardHeader className="bg-gradient-to-r from-accent/5 to-primary/5 border-b">
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros Avançados
          </CardTitle>
          <CardDescription>Use os filtros para visualizar diferentes conjuntos de dados</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Button
                variant={activeFilter === "todos" ? "default" : "outline"}
                onClick={showAllContas}
                className="gap-2"
              >
                <CreditCard className="w-4 h-4" />
                Todas as Contas
              </Button>
              <Button
                variant={activeFilter === "pares-agencia" ? "default" : "outline"}
                onClick={fetchParesContas}
                className="gap-2"
              >
                <Building2 className="w-4 h-4" />
                Pares por Agência
              </Button>
            </div>

            <div className="border-t pt-4">
              <Label className="text-sm font-medium text-foreground mb-3 block">Buscar por Faixa de Saldo</Label>
              <div className="flex flex-wrap gap-3 items-end">
                <div className="space-y-2">
                  <Label htmlFor="saldoMin" className="text-xs text-muted-foreground">
                    Saldo Mínimo
                  </Label>
                  <Input
                    id="saldoMin"
                    type="number"
                    step="0.01"
                    value={saldoMin}
                    onChange={(e) => setSaldoMin(e.target.value)}
                    className="w-32"
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="saldoMax" className="text-xs text-muted-foreground">
                    Saldo Máximo
                  </Label>
                  <Input
                    id="saldoMax"
                    type="number"
                    step="0.01"
                    value={saldoMax}
                    onChange={(e) => setSaldoMax(e.target.value)}
                    className="w-32"
                    placeholder="0.00"
                  />
                </div>
                <Button
                  onClick={fetchContasPorSaldo}
                  variant={activeFilter === "faixa-saldo" ? "default" : "outline"}
                  className="gap-2"
                >
                  <DollarSign className="w-4 h-4" />
                  Buscar por Saldo
                </Button>
              </div>
            </div>

            <div className="border-t pt-4 space-y-4">
              <Label className="text-sm font-medium text-foreground">Busca Individual</Label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label className="text-xs text-muted-foreground">Buscar por Número da Conta</Label>
                  <div className="flex gap-2">
                    <Input
                      value={searchNumero}
                      onChange={(e) => setSearchNumero(e.target.value)}
                      placeholder="Digite o número da conta"
                      className="flex-1"
                    />
                    <Button onClick={buscarPorNumero} variant="outline" className="gap-2 bg-transparent">
                      <CreditCard className="w-4 h-4" />
                      Buscar
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-xs text-muted-foreground">Buscar por ID</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={searchId}
                      onChange={(e) => setSearchId(e.target.value)}
                      placeholder="Digite o ID da conta"
                      className="flex-1"
                    />
                    <Button onClick={buscarPorId} variant="outline" className="gap-2 bg-transparent">
                      <Filter className="w-4 h-4" />
                      Buscar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-foreground">
            {activeFilter === "todos" && "Lista de Contas"}
            {activeFilter === "pares-agencia" && "Pares de Contas por Agência"}
            {activeFilter === "faixa-saldo" &&
              `Contas com Saldo entre ${formatCurrency(Number(saldoMin) || 0)} e ${formatCurrency(Number(saldoMax) || 0)}`}
            {activeFilter === "busca-individual" && "Resultado da Busca"}
          </h2>
          <span className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm font-medium">
            {activeFilter === "todos" && `${contas.length} registros`}
            {activeFilter === "pares-agencia" && `${paresContas.length} pares`}
            {activeFilter === "faixa-saldo" && `${contasFiltradas.length} registros`}
            {activeFilter === "busca-individual" && "1 registro"}
          </span>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg"
        >
          + Nova Conta
        </Button>
      </div>

      {/* Existing form code */}
      {showForm && (
        <Card className="card-shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-accent/5 to-primary/5 border-b">
            <CardTitle className="text-xl">{editingConta ? "Editar Conta" : "Nova Conta"}</CardTitle>
            <CardDescription>
              {editingConta ? "Atualize as informações da conta" : "Preencha os dados da nova conta"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="idConta" className="text-sm font-medium text-foreground">
                    ID Conta *
                  </Label>
                  <Input
                    id="idConta"
                    type="number"
                    value={formData.idConta}
                    onChange={(e) => setFormData({ ...formData, idConta: Number.parseInt(e.target.value) || 0 })}
                    required
                    className="h-11 border-border focus:border-accent focus:ring-accent/20"
                    placeholder="Digite o ID da conta"
                    min="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="agencia" className="text-sm font-medium text-foreground">
                    Agência *
                  </Label>
                  <Input
                    id="agencia"
                    value={formData.agencia}
                    onChange={(e) => setFormData({ ...formData, agencia: e.target.value })}
                    required
                    className="h-11 border-border focus:border-accent focus:ring-accent/20"
                    placeholder="Ex: 1234"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="numero" className="text-sm font-medium text-foreground">
                    Número da Conta *
                  </Label>
                  <Input
                    id="numero"
                    value={formData.numero}
                    onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                    required
                    className="h-11 border-border focus:border-accent focus:ring-accent/20"
                    placeholder="Ex: 12345-6"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="saldo" className="text-sm font-medium text-foreground">
                    Saldo *
                  </Label>
                  <Input
                    id="saldo"
                    type="number"
                    step="0.01"
                    value={formData.saldo}
                    onChange={(e) => setFormData({ ...formData, saldo: Number.parseFloat(e.target.value) || 0 })}
                    required
                    className="h-11 border-border focus:border-accent focus:ring-accent/20"
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="id_Cliente" className="text-sm font-medium text-foreground">
                    ID Cliente
                  </Label>
                  <Input
                    id="id_Cliente"
                    type="number"
                    value={formData.id_Cliente || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        id_Cliente: e.target.value ? Number.parseInt(e.target.value) : undefined,
                      })
                    }
                    className="h-11 border-border focus:border-accent focus:ring-accent/20"
                    placeholder="ID do cliente (opcional)"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground px-8">
                  {editingConta ? "Atualizar" : "Criar"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm} className="px-8 bg-transparent">
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card className="card-shadow border-0">
        <div className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  {activeFilter === "pares-agencia" ? (
                    <>
                      <th className="p-4 text-left text-sm font-semibold text-foreground">Agência</th>
                      <th className="p-4 text-left text-sm font-semibold text-foreground">Conta 1</th>
                      <th className="p-4 text-left text-sm font-semibold text-foreground">Conta 2</th>
                    </>
                  ) : (
                    <>
                      <th className="p-4 text-left text-sm font-semibold text-foreground">ID</th>
                      <th className="p-4 text-left text-sm font-semibold text-foreground">Agência</th>
                      <th className="p-4 text-left text-sm font-semibold text-foreground">Número</th>
                      <th className="p-4 text-left text-sm font-semibold text-foreground">Saldo</th>
                      <th className="p-4 text-left text-sm font-semibold text-foreground">ID Cliente</th>
                      <th className="p-4 text-left text-sm font-semibold text-foreground">Ações</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {activeFilter === "pares-agencia" &&
                  paresContas.map((par, index) => (
                    <tr
                      key={`${par.agencia}-${par.numeroConta1}-${par.numeroConta2}`}
                      className={`border-b border-border hover:bg-muted/30 transition-colors ${
                        index % 2 === 0 ? "bg-background" : "bg-muted/10"
                      }`}
                    >
                      <td className="p-4">
                        <span className="bg-accent/10 text-accent-foreground px-2 py-1 rounded-md text-sm font-medium">
                          {par.agencia}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-sm">{par.numeroConta1}</td>
                      <td className="p-4 font-mono text-sm">{par.numeroConta2}</td>
                    </tr>
                  ))}

                {activeFilter === "busca-individual" && contaEncontrada && (
                  <tr className="border-b border-border hover:bg-muted/30 transition-colors bg-background">
                    <td className="p-4">
                      <span
                      className="bg-accent/10 text-accent-foreground px-2 py-1 rounded-md text-sm font-medium">
                        {contaEncontrada.idConta}
                      </span>
                    </td>
                    <td className="p-4 font-medium text-foreground">{contaEncontrada.agencia}</td>
                    <td className="p-4 font-mono text-sm">{contaEncontrada.numero}</td>
                    <td className="p-4">
                      <span
                        className={`font-semibold ${contaEncontrada.saldo >= 0 ? "text-success" : "text-destructive"}`}
                      >
                        {formatCurrency(contaEncontrada.saldo)}
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground">{contaEncontrada.id_Cliente || "—"}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditForm(contaEncontrada)}
                          className="h-8 px-3 text-xs hover:bg-accent hover:text-accent-foreground"
                        >
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(contaEncontrada.idConta)}
                          className="h-8 px-3 text-xs"
                        >
                          Excluir
                        </Button>
                      </div>
                    </td>
                  </tr>
                )}

                {(activeFilter === "todos" ? contas : activeFilter === "faixa-saldo" ? contasFiltradas : []).map(
                  (conta, index) => (
                    <tr
                      key={conta.idConta}
                      className={`border-b border-border hover:bg-muted/30 transition-colors ${
                        index % 2 === 0 ? "bg-background" : "bg-muted/10"
                      }`}
                    >
                      <td className="p-4">
                        <span 
                        style={{ color: '#000000' }}
                        className="bg-accent/10 text-accent-foreground px-2 py-1 rounded-md text-sm font-medium">
                          {conta.idConta}
                        </span>
                      </td>
                      <td className="p-4 font-medium text-foreground">{conta.agencia}</td>
                      <td className="p-4 font-mono text-sm">{conta.numero}</td>
                      <td className="p-4">
                        <span className={`font-semibold ${conta.saldo >= 0 ? "text-success" : "text-destructive"}`}>
                          {formatCurrency(conta.saldo)}
                        </span>
                      </td>
                      <td className="p-4 text-muted-foreground">{conta.id_Cliente || "—"}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditForm(conta)}
                            className="h-8 px-3 text-xs hover:bg-accent hover:text-accent-foreground"
                          >
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(conta.idConta)}
                            className="h-8 px-3 text-xs"
                          >
                            Excluir
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>

            {((activeFilter === "todos" && contas.length === 0) ||
              (activeFilter === "pares-agencia" && paresContas.length === 0) ||
              (activeFilter === "faixa-saldo" && contasFiltradas.length === 0) ||
              (activeFilter === "busca-individual" && !contaEncontrada)) && (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {activeFilter === "todos" && "Nenhuma conta cadastrada"}
                  {activeFilter === "pares-agencia" && "Nenhum par de contas encontrado"}
                  {activeFilter === "faixa-saldo" && "Nenhuma conta encontrada nesta faixa de saldo"}
                  {activeFilter === "busca-individual" && "Nenhuma conta encontrada com esse ID ou número"}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {activeFilter === "todos" && "Comece adicionando a primeira conta ao sistema"}
                  {activeFilter === "pares-agencia" && "Não há pares de contas na mesma agência"}
                  {activeFilter === "faixa-saldo" && "Tente ajustar os valores de saldo mínimo e máximo"}
                  {activeFilter === "busca-individual" && "Verifique o ID ou número da conta e tente novamente"}
                </p>
                {activeFilter === "todos" && (
                  <Button onClick={() => setShowForm(true)} className="bg-accent hover:bg-accent/90">
                    + Adicionar Conta
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
