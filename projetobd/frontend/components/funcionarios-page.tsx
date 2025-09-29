"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Filter, Users, UserCheck } from "lucide-react"

interface Funcionario {
  idFuncionario: number
  nome: string
  funcao: string
  id_solicitacao?: number
  idSupervisor?: number
}

interface FuncionarioSupervisorDTO {
  idFuncionario: number
  nomeFuncionario: string
  funcao: string
  nomeSupervisor?: string
}

export function FuncionariosPage() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([])
  const [funcionariosComSupervisor, setFuncionariosComSupervisor] = useState<FuncionarioSupervisorDTO[]>([])
  const [supervisores, setSupervisores] = useState<Funcionario[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingFuncionario, setEditingFuncionario] = useState<Funcionario | null>(null)
  const [activeFilter, setActiveFilter] = useState<"todos" | "com-supervisor" | "supervisores" | "busca-individual">(
      "todos",
  )

  const [searchNome, setSearchNome] = useState<string>("")
  const [searchId, setSearchId] = useState<string>("")
  const [funcionarioEncontrado, setFuncionarioEncontrado] = useState<Funcionario | null>(null)

  const [formData, setFormData] = useState<Funcionario>({
    idFuncionario: 0,
    nome: "",
    funcao: "",
    id_solicitacao: undefined,
    idSupervisor: undefined,
  })

  useEffect(() => {
    fetchFuncionarios()
  }, [])

  const fetchFuncionarios = async () => {
    try {
      console.log("[v0] Buscando funcionários...")
      const response = await fetch("http://localhost:8080/api/funcionarios")
      console.log("[v0] Response status:", response.status)

      if (response.ok) {
        const data = await response.json()
        console.log("[v0] Dados recebidos:", data)
        setFuncionarios(data)
      } else {
        console.log("[v0] Erro na resposta:", response.statusText)
        alert("Erro ao carregar funcionários. Verifique se o backend está rodando.")
      }
    } catch (error) {
      console.log("[v0] Erro de conexão:", error)
      alert("Erro de conexão. Verifique se o backend está rodando na porta 8080.")
    } finally {
      setLoading(false)
    }
  }

  const fetchFuncionariosComSupervisor = async () => {
    try {
      setLoading(true)
      console.log("[v0] Buscando funcionários com supervisor...")
      const response = await fetch("http://localhost:8080/api/funcionarios/com-supervisor")

      if (response.ok) {
        const data = await response.json()
        console.log("[v0] Funcionários com supervisor:", data)
        setFuncionariosComSupervisor(data)
        setActiveFilter("com-supervisor")
      } else {
        alert("Erro ao carregar funcionários com supervisor.")
      }
    } catch (error) {
      console.log("[v0] Erro:", error)
      alert("Erro de conexão.")
    } finally {
      setLoading(false)
    }
  }

  const fetchSupervisores = async () => {
    try {
      setLoading(true)
      console.log("[v0] Buscando supervisores...")
      const response = await fetch("http://localhost:8080/api/funcionarios/supervisores")

      if (response.ok) {
        const data = await response.json()
        console.log("[v0] Supervisores:", data)
        setSupervisores(data)
        setActiveFilter("supervisores")
      } else {
        alert("Erro ao carregar supervisores.")
      }
    } catch (error) {
      console.log("[v0] Erro:", error)
      alert("Erro de conexão.")
    } finally {
      setLoading(false)
    }
  }

  const showAllFuncionarios = () => {
    setActiveFilter("todos")
    fetchFuncionarios()
  }

  const buscarPorNome = async () => {
    if (!searchNome.trim()) {
      alert("Por favor, digite um nome para buscar.")
      return
    }

    try {
      setLoading(true)
      console.log("[v0] Buscando funcionário por nome:", searchNome)
      const response = await fetch(`http://localhost:8080/api/funcionarios/nome/${encodeURIComponent(searchNome)}`)

      if (response.ok) {
        const data = await response.json()
        console.log("[v0] Funcionário encontrado:", data)
        if (data) {
          setFuncionarioEncontrado(data)
          setActiveFilter("busca-individual")
        } else {
          alert("Nenhum funcionário encontrado com esse nome.")
        }
      } else if (response.status === 404) {
        alert("Funcionário não encontrado com esse nome.")
      } else {
        alert("Erro ao buscar funcionário por nome.")
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
      console.log("[v0] Buscando funcionário por ID:", searchId)
      const response = await fetch(`http://localhost:8080/api/funcionarios/${searchId}`)

      if (response.ok) {
        const data = await response.json()
        console.log("[v0] Funcionário encontrado:", data)
        setFuncionarioEncontrado(data)
        setActiveFilter("busca-individual")
      } else if (response.status === 404) {
        alert("Funcionário não encontrado com esse ID.")
      } else {
        alert("Erro ao buscar funcionário por ID.")
      }
    } catch (error) {
      console.log("[v0] Erro:", error)
      alert("Erro de conexão.")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    console.log("[v0] Iniciando salvamento...")
    console.log("[v0] Dados do formulário:", formData)
    console.log("[v0] Editando funcionário:", editingFuncionario)

    try {
      const url = editingFuncionario
          ? `http://localhost:8080/api/funcionarios/${editingFuncionario.idFuncionario}`
          : "http://localhost:8080/api/funcionarios"

      const method = editingFuncionario ? "PUT" : "POST"

      console.log("[v0] URL:", url)
      console.log("[v0] Método:", method)
      console.log("[v0] Payload:", JSON.stringify(formData))

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      console.log("[v0] Response status:", response.status)
      console.log("[v0] Response headers:", response.headers)

      if (response.ok) {
        const responseData = await response.text()
        console.log("[v0] Response data:", responseData)
        alert(`Funcionário ${editingFuncionario ? "atualizado" : "criado"} com sucesso!`)
        fetchFuncionarios()
        resetForm()
      } else {
        const errorText = await response.text()
        console.log("[v0] Erro na resposta:", errorText)
        alert(`Erro ao salvar funcionário. Status: ${response.status}. Erro: ${errorText}`)
      }
    } catch (error) {
      console.log("[v0] Erro de conexão:", error)
      alert("Erro de conexão com o servidor.")
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este funcionário?")) return

    try {
      console.log("[v0] Excluindo funcionário ID:", id)
      const response = await fetch(`http://localhost:8080/api/funcionarios/${id}`, {
        method: "DELETE",
      })

      console.log("[v0] Delete response status:", response.status)

      if (response.ok) {
        alert("Funcionário excluído com sucesso!")
        fetchFuncionarios()
      } else {
        const errorText = await response.text()
        console.log("[v0] Erro ao excluir:", errorText)
        alert(`Erro ao excluir funcionário. Status: ${response.status}`)
      }
    } catch (error) {
      console.log("[v0] Erro de conexão ao excluir:", error)
      alert("Erro de conexão com o servidor.")
    }
  }

  const resetForm = () => {
    setFormData({
      idFuncionario: 0,
      nome: "",
      funcao: "",
      id_solicitacao: undefined,
      idSupervisor: undefined,
    })
    setEditingFuncionario(null)
    setShowForm(false)
  }

  const openEditForm = (funcionario: Funcionario) => {
    setEditingFuncionario(funcionario)
    setFormData(funcionario)
    setShowForm(true)
  }

  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-muted-foreground">Carregando funcionários...</p>
          </div>
        </div>
    )
  }

  return (
      <div className="space-y-8">
        <div className="gradient-primary rounded-xl p-8 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Funcionários</h1>
              <p className="text-white/80">Gerencie os funcionários do sistema</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{funcionarios.length}</div>
              <div className="text-white/80 text-sm">Total cadastrados</div>
            </div>
          </div>
        </div>

        <Card className="card-shadow border-0">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b">
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filtros Avançados
            </CardTitle>
            <CardDescription>Use os filtros para visualizar diferentes conjuntos de dados</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="flex flex-wrap gap-3">
                <Button
                    variant={activeFilter === "todos" ? "default" : "outline"}
                    onClick={showAllFuncionarios}
                    className="gap-2"
                >
                  <Users className="w-4 h-4" />
                  Todos os Funcionários
                </Button>
                <Button
                    variant={activeFilter === "com-supervisor" ? "default" : "outline"}
                    onClick={fetchFuncionariosComSupervisor}
                    className="gap-2"
                >
                  <UserCheck className="w-4 h-4" />
                  Com Supervisor
                </Button>
                <Button
                    variant={activeFilter === "supervisores" ? "default" : "outline"}
                    onClick={fetchSupervisores}
                    className="gap-2"
                >
                  <UserCheck className="w-4 h-4" />
                  Apenas Supervisores
                </Button>
              </div>

              <div className="border-t pt-4 space-y-4">
                <Label className="text-sm font-medium text-foreground">Busca Individual</Label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label className="text-xs text-muted-foreground">Buscar por Nome</Label>
                    <div className="flex gap-2">
                      <Input
                          value={searchNome}
                          onChange={(e) => setSearchNome(e.target.value)}
                          placeholder="Digite o nome do funcionário"
                          className="flex-1"
                      />
                      <Button onClick={buscarPorNome} variant="outline" className="gap-2 bg-transparent">
                        <Users className="w-4 h-4" />
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
                          placeholder="Digite o ID do funcionário"
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
              {activeFilter === "todos" && "Lista de Funcionários"}
              {activeFilter === "com-supervisor" && "Funcionários com Supervisor"}
              {activeFilter === "supervisores" && "Lista de Supervisores"}
              {activeFilter === "busca-individual" && "Resultado da Busca"}
            </h2>
            <span className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm font-medium">
            {activeFilter === "todos" && `${funcionarios.length} registros`}
              {activeFilter === "com-supervisor" && `${funcionariosComSupervisor.length} registros`}
              {activeFilter === "supervisores" && `${supervisores.length} registros`}
              {activeFilter === "busca-individual" && "1 registro"}
          </span>
          </div>
          <Button
              onClick={() => setShowForm(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
          >
            + Novo Funcionário
          </Button>
        </div>

        {showForm && (
            <Card className="card-shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b">
                <CardTitle className="text-xl">{editingFuncionario ? "Editar Funcionário" : "Novo Funcionário"}</CardTitle>
                <CardDescription>
                  {editingFuncionario ? "Atualize as informações do funcionário" : "Preencha os dados do novo funcionário"}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="idFuncionario" className="text-sm font-medium text-foreground">
                        ID Funcionário *
                      </Label>
                      <Input
                          id="idFuncionario"
                          type="number"
                          value={formData.idFuncionario}
                          onChange={(e) => setFormData({ ...formData, idFuncionario: Number.parseInt(e.target.value) || 0 })}
                          required
                          className="h-11 border-border focus:border-primary focus:ring-primary/20"
                          placeholder="Digite o ID do funcionário"
                          min="1"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nome" className="text-sm font-medium text-foreground">
                        Nome *
                      </Label>
                      <Input
                          id="nome"
                          value={formData.nome}
                          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                          required
                          className="h-11 border-border focus:border-primary focus:ring-primary/20"
                          placeholder="Digite o nome completo"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="funcao" className="text-sm font-medium text-foreground">
                        Função *
                      </Label>
                      <Input
                          id="funcao"
                          value={formData.funcao}
                          onChange={(e) => setFormData({ ...formData, funcao: e.target.value })}
                          required
                          className="h-11 border-border focus:border-primary focus:ring-primary/20"
                          placeholder="Ex: Gerente, Analista, etc."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="id_solicitacao" className="text-sm font-medium text-foreground">
                        ID Solicitação
                      </Label>
                      <Input
                          id="id_solicitacao"
                          type="number"
                          value={formData.id_solicitacao || ""}
                          onChange={(e) =>
                              setFormData({
                                ...formData,
                                id_solicitacao: e.target.value ? Number.parseInt(e.target.value) : undefined,
                              })
                          }
                          className="h-11 border-border focus:border-primary focus:ring-primary/20"
                          placeholder="ID da solicitação (opcional)"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="idSupervisor" className="text-sm font-medium text-foreground">
                        ID Supervisor
                      </Label>
                      <Input
                          id="idSupervisor"
                          type="number"
                          value={formData.idSupervisor || ""}
                          onChange={(e) =>
                              setFormData({
                                ...formData,
                                idSupervisor: e.target.value ? Number.parseInt(e.target.value) : undefined,
                              })
                          }
                          className="h-11 border-border focus:border-primary focus:ring-primary/20"
                          placeholder="ID do supervisor (opcional)"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">
                      {editingFuncionario ? "Atualizar" : "Criar"}
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
                  <th className="p-4 text-left text-sm font-semibold text-foreground">ID</th>
                  <th className="p-4 text-left text-sm font-semibold text-foreground">Nome</th>
                  <th className="p-4 text-left text-sm font-semibold text-foreground">Função</th>
                  {activeFilter === "com-supervisor" && (
                      <th className="p-4 text-left text-sm font-semibold text-foreground">Supervisor</th>
                  )}
                  {(activeFilter === "todos" ||
                      activeFilter === "supervisores" ||
                      activeFilter === "busca-individual") && (
                      <>
                        <th className="p-4 text-left text-sm font-semibold text-foreground">ID Solicitação</th>
                        <th className="p-4 text-left text-sm font-semibold text-foreground">ID Supervisor</th>
                      </>
                  )}
                  <th className="p-4 text-left text-sm font-semibold text-foreground">Ações</th>
                </tr>
                </thead>
                <tbody>
                {activeFilter === "busca-individual" && funcionarioEncontrado && (
                    <tr className="border-b border-border hover:bg-muted/30 transition-colors bg-background">
                      <td className="p-4">
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm font-medium">
                        {funcionarioEncontrado.idFuncionario}
                      </span>
                      </td>
                      <td className="p-4 font-medium text-foreground">{funcionarioEncontrado.nome}</td>
                      <td className="p-4">
                      <span className="bg-accent/10 text-accent-foreground px-2 py-1 rounded-md text-sm">
                        {funcionarioEncontrado.funcao}
                      </span>
                      </td>
                      <td className="p-4 text-muted-foreground">{funcionarioEncontrado.id_solicitacao || "—"}</td>
                      <td className="p-4 text-muted-foreground">{funcionarioEncontrado.idSupervisor || "—"}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openEditForm(funcionarioEncontrado)}
                              className="h-8 px-3 text-xs hover:bg-primary hover:text-primary-foreground"
                          >
                            Editar
                          </Button>
                          <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(funcionarioEncontrado.idFuncionario)}
                              className="h-8 px-3 text-xs"
                          >
                            Excluir
                          </Button>
                        </div>
                      </td>
                    </tr>
                )}

                {activeFilter === "todos" &&
                    funcionarios.map((funcionario, index) => (
                        <tr
                            key={funcionario.idFuncionario}
                            className={`border-b border-border hover:bg-muted/30 transition-colors ${
                                index % 2 === 0 ? "bg-background" : "bg-muted/10"
                            }`}
                        >
                          <td className="p-4">
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm font-medium">
                          {funcionario.idFuncionario}
                        </span>
                          </td>
                          <td className="p-4 font-medium text-foreground">{funcionario.nome}</td>
                          <td className="p-4">
                        <span className="bg-accent/10 text-accent-foreground px-2 py-1 rounded-md text-sm">
                          {funcionario.funcao}
                        </span>
                          </td>
                          <td className="p-4 text-muted-foreground">{funcionario.id_solicitacao || "—"}</td>
                          <td className="p-4 text-muted-foreground">{funcionario.idSupervisor || "—"}</td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => openEditForm(funcionario)}
                                  className="h-8 px-3 text-xs hover:bg-primary hover:text-primary-foreground"
                              >
                                Editar
                              </Button>
                              <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDelete(funcionario.idFuncionario)}
                                  className="h-8 px-3 text-xs"
                              >
                                Excluir
                              </Button>
                            </div>
                          </td>
                        </tr>
                    ))}

                {activeFilter === "com-supervisor" &&
                    funcionariosComSupervisor.map((funcionario, index) => (
                        <tr
                            key={funcionario.idFuncionario}
                            className={`border-b border-border hover:bg-muted/30 transition-colors ${
                                index % 2 === 0 ? "bg-background" : "bg-muted/10"
                            }`}
                        >
                          <td className="p-4">
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm font-medium">
                          {funcionario.idFuncionario}
                        </span>
                          </td>
                          <td className="p-4 font-medium text-foreground">{funcionario.nomeFuncionario}</td>
                          <td className="p-4">
                        <span className="bg-accent/10 text-accent-foreground px-2 py-1 rounded-md text-sm">
                          {funcionario.funcao}
                        </span>
                          </td>
                          <td className="p-4">
                            {funcionario.nomeSupervisor ? (
                                <span className="bg-success/10 text-success px-2 py-1 rounded-md text-sm font-medium">
                            {funcionario.nomeSupervisor}
                          </span>
                            ) : (
                                <span className="text-muted-foreground text-sm">Sem supervisor</span>
                            )}
                          </td>
                          <td className="p-4">
                            <span className="text-muted-foreground text-sm">Visualização apenas</span>
                          </td>
                        </tr>
                    ))}

                {activeFilter === "supervisores" &&
                    supervisores.map((funcionario, index) => (
                        <tr
                            key={funcionario.idFuncionario}
                            className={`border-b border-border hover:bg-muted/30 transition-colors ${
                                index % 2 === 0 ? "bg-background" : "bg-muted/10"
                            }`}
                        >
                          <td className="p-4">
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm font-medium">
                          {funcionario.idFuncionario}
                        </span>
                          </td>
                          <td className="p-4 font-medium text-foreground">{funcionario.nome}</td>
                          <td className="p-4">
                        <span className="bg-accent/10 text-accent-foreground px-2 py-1 rounded-md text-sm">
                          {funcionario.funcao}
                        </span>
                          </td>
                          <td className="p-4 text-muted-foreground">{funcionario.id_solicitacao || "—"}</td>
                          <td className="p-4 text-muted-foreground">{funcionario.idSupervisor || "—"}</td>
                          <td className="p-4">
                            <span className="text-muted-foreground text-sm">Visualização apenas</span>
                          </td>
                        </tr>
                    ))}
                </tbody>
              </table>

              {((activeFilter === "todos" && funcionarios.length === 0) ||
                  (activeFilter === "com-supervisor" && funcionariosComSupervisor.length === 0) ||
                  (activeFilter === "supervisores" && supervisores.length === 0) ||
                  (activeFilter === "busca-individual" && !funcionarioEncontrado)) && (
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {activeFilter === "todos" && "Nenhum funcionário cadastrado"}
                      {activeFilter === "com-supervisor" && "Nenhum funcionário com supervisor encontrado"}
                      {activeFilter === "supervisores" && "Nenhum supervisor encontrado"}
                      {activeFilter === "busca-individual" && "Nenhum funcionário encontrado"}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {activeFilter === "todos" && "Comece adicionando o primeiro funcionário ao sistema"}
                      {activeFilter === "com-supervisor" && "Não há funcionários com supervisores cadastrados"}
                      {activeFilter === "supervisores" && "Não há funcionários que sejam supervisores"}
                      {activeFilter === "busca-individual" && "Por favor, verifique o nome ou ID e tente novamente."}
                    </p>
                    {activeFilter === "todos" && (
                        <Button onClick={() => setShowForm(true)} className="bg-primary hover:bg-primary/90">
                          + Adicionar Funcionário
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
