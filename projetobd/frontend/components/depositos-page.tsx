"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDownCircle } from "lucide-react"

interface Deposito {
  idTransacao: number
  valor: number
  data_transacao: string
  idConta: number
}

export function DepositosPage() {
  const [depositos, setDepositos] = useState<Deposito[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingDeposito, setEditingDeposito] = useState<Deposito | null>(null)

  const [formData, setFormData] = useState({
    idTransacao: 0,
    valor: 0,
    data_transacao: "",
    idConta: 0,
  })

  useEffect(() => {
    fetchDepositos()
  }, [])

  const fetchDepositos = async () => {
    try {
      console.log("[v0] Buscando depósitos...")
      const response = await fetch("http://localhost:8080/api/depositos")
      console.log("[v0] Status da resposta:", response.status)

      if (response.ok) {
        const data = await response.json()
        console.log("[v0] Depósitos recebidos:", data)
        setDepositos(data)
      } else {
        console.error("[v0] Erro ao carregar depósitos:", response.status)
        alert("Erro ao carregar depósitos. Verifique se o backend está rodando.")
      }
    } catch (error) {
      console.error("[v0] Erro de conexão:", error)
      alert("Erro de conexão. Certifique-se de que o backend está rodando em http://localhost:8080")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const dataFormatada = formData.data_transacao.replace("T", " ") + ":00"

    const payload = {
      idTransacao: formData.idTransacao,
      valor: formData.valor,
      data_transacao: dataFormatada,
      idConta: formData.idConta,
    }

    console.log("[v0] Enviando payload:", payload)

    try {
      const url = editingDeposito
        ? `http://localhost:8080/api/depositos/${editingDeposito.idTransacao}`
        : "http://localhost:8080/api/depositos"

      const method = editingDeposito ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      console.log("[v0] Status da resposta:", response.status)

      if (response.ok) {
        alert(`Depósito ${editingDeposito ? "atualizado" : "criado"} com sucesso!`)
        fetchDepositos()
        resetForm()
      } else {
        const errorText = await response.text()
        console.error("[v0] Erro do servidor:", errorText)
        alert(`Erro ao salvar depósito: ${errorText}`)
      }
    } catch (error) {
      console.error("[v0] Erro de conexão:", error)
      alert("Erro de conexão com o servidor.")
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este depósito?")) return

    try {
      const response = await fetch(`http://localhost:8080/api/depositos/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        alert("Depósito excluído com sucesso!")
        fetchDepositos()
      } else {
        alert("Erro ao excluir depósito.")
      }
    } catch (error) {
      alert("Erro de conexão.")
    }
  }

  const resetForm = () => {
    setFormData({
      idTransacao: 0,
      valor: 0,
      data_transacao: "",
      idConta: 0,
    })
    setEditingDeposito(null)
    setShowForm(false)
  }

  const openEditForm = (deposito: Deposito) => {
    setEditingDeposito(deposito)
    const dataLocal = deposito.data_transacao.replace(" ", "T").substring(0, 16)
    setFormData({
      ...deposito,
      data_transacao: dataLocal,
    })
    setShowForm(true)
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Carregando depósitos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-8 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Depósitos</h1>
            <p className="text-white/80">Gerencie os depósitos do sistema</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{depositos.length}</div>
            <div className="text-white/80 text-sm">Total de depósitos</div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-foreground">Lista de Depósitos</h2>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-green-600 hover:bg-green-700 text-white shadow-lg gap-2"
        >
          <ArrowDownCircle className="w-4 h-4" />
          Novo Depósito
        </Button>
      </div>

      {showForm && (
        <Card className="card-shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
            <CardTitle className="text-xl">{editingDeposito ? "Editar Depósito" : "Novo Depósito"}</CardTitle>
            <CardDescription>
              {editingDeposito ? "Atualize as informações do depósito" : "Preencha os dados do novo depósito"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="idTransacao">ID Transação *</Label>
                  <Input
                    id="idTransacao"
                    type="number"
                    value={formData.idTransacao}
                    onChange={(e) => setFormData({ ...formData, idTransacao: Number.parseInt(e.target.value) || 0 })}
                    required
                    min="1"
                    disabled={!!editingDeposito}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="valor">Valor *</Label>
                  <Input
                    id="valor"
                    type="number"
                    step="0.01"
                    value={formData.valor}
                    onChange={(e) => setFormData({ ...formData, valor: Number.parseFloat(e.target.value) || 0 })}
                    required
                    min="0.01"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="data_transacao">Data da Transação *</Label>
                  <Input
                    id="data_transacao"
                    type="datetime-local"
                    value={formData.data_transacao}
                    onChange={(e) => setFormData({ ...formData, data_transacao: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="idConta">ID da Conta *</Label>
                  <Input
                    id="idConta"
                    type="number"
                    value={formData.idConta}
                    onChange={(e) => setFormData({ ...formData, idConta: Number.parseInt(e.target.value) || 0 })}
                    required
                    min="1"
                  />
                  <p className="text-xs text-muted-foreground">A conta deve existir no sistema</p>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="submit" className="bg-green-600 hover:bg-green-700 px-8">
                  {editingDeposito ? "Atualizar" : "Criar"}
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
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="p-4 text-left text-sm font-semibold">ID Transação</th>
                <th className="p-4 text-left text-sm font-semibold">Valor</th>
                <th className="p-4 text-left text-sm font-semibold">Data</th>
                <th className="p-4 text-left text-sm font-semibold">ID Conta</th>
                <th className="p-4 text-left text-sm font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {depositos.map((deposito, index) => (
                <tr
                  key={deposito.idTransacao}
                  className={`border-b border-border hover:bg-muted/30 transition-colors ${
                    index % 2 === 0 ? "bg-background" : "bg-muted/10"
                  }`}
                >
                  <td className="p-4">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-sm font-medium">
                      {deposito.idTransacao}
                    </span>
                  </td>
                  <td className="p-4 font-semibold text-green-600">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(deposito.valor)}
                  </td>
                  <td className="p-4 text-sm">{deposito.data_transacao}</td>
                  <td className="p-4">{deposito.idConta}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditForm(deposito)}
                        className="h-8 px-3 text-xs"
                      >
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(deposito.idTransacao)}
                        className="h-8 px-3 text-xs"
                      >
                        Excluir
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {depositos.length === 0 && !loading && (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowDownCircle className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Nenhum depósito encontrado</h3>
              <p className="text-muted-foreground mb-4">
                Comece adicionando o primeiro depósito ou verifique se o backend está rodando
              </p>
              <Button onClick={() => setShowForm(true)} className="bg-green-600 hover:bg-green-700">
                + Adicionar Depósito
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
