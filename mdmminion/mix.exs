defmodule MDMMinion.MixProject do
  use Mix.Project

  def project do
    [
      app: :mdmminion,
      version: "0.1.0",
      elixir: "~> 1.6",
      start_permanent: Mix.env() == :prod,
      deps: deps()
    ]
  end

  # Run "mix help compile.app" to learn about applications.
  def application do
    [
      mod: {MDMMinion.MDMMinionApp, []},
      extra_applications: [:logger]
    ]
  end

  # Run "mix help deps" to learn about dependencies.
  defp deps do
    [
      {:erlexec, git: "https://github.com/saleyn/erlexec.git", tag: "1.9"}
      # {:dep_from_hexpm, "~> 0.3.0"},
      # {:dep_from_git, git: "https://github.com/elixir-lang/my_dep.git", tag: "0.1.0"},
    ]
  end

end

defmodule Mix.Tasks.CompileC do
  use Mix.Task

  def run(_) do
    if match? {:win32, _}, :os.type do
      IO.warn("Windows is not supported.")
      exit(1)
    else
      File.rm_rf("priv")
      File.mkdir("priv")
      {result, _error_code} = System.cmd("make", ["priv/backend_nif.so"], stderr_to_stdout: true)
      IO.binwrite result
    end
    :ok
  end
end

