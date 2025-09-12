{
  description = "Dev shell with Podman";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils, ... }: flake-utils.lib.eachDefaultSystem (system:
    let
        pkgs = nixpkgs.legacyPackages.${system};
        # wrapper for tsx, since it is not in nodePackages
        tsx = pkgs.writeShellScriptBin "tsx"
          ''
            exec npx tsx "$@"
          '';
        # copies config files if they do not exist in home folder
        podmanSetupScript = let
          registriesConf = pkgs.writeText "registries.conf" ''
            [registries.search]
            registries = ['docker.io']
            [registries.block]
            registries = []
          '';
        in pkgs.writeScript "podman-setup" ''
          #!${pkgs.runtimeShell}
          # Dont overwrite customised configuration
          if ! test -f ~/.config/containers/policy.json; then
            install -Dm555 ${pkgs.skopeo.src}/default-policy.json ~/.config/containers/policy.json
          fi
          if ! test -f ~/.config/containers/registries.conf; then
            install -Dm555 ${registriesConf} ~/.config/containers/registries.conf
          fi
        '';
        # Provides a fake "docker" binary mapping to podman
        dockerCompat = pkgs.runCommandNoCC "docker-podman-compat" {} ''
          mkdir -p $out/bin
          ln -s ${pkgs.podman}/bin/podman $out/bin/docker
        '';

    in {
      devShells.default = self.devShells.${system}.node-shell;
      devShells.node-shell = pkgs.mkShell {
        buildInputs = [
          pkgs.nodejs 
          pkgs.esbuild
          pkgs.nodePackages.typescript-language-server
          pkgs.nodePackages.typescript
          tsx
        ];
      };
      devShells.podman-shell = pkgs.mkShell {
        buildInputs = [
          # For emulating a Nix-less setup
          dockerCompat
          pkgs.podman  # Docker compat
          pkgs.runc  # Container runtime
          pkgs.conmon  # Container runtime monitor
          pkgs.skopeo  # Interact with container registry
          pkgs.slirp4netns  # User-mode networking for unprivileged namespaces
          pkgs.fuse-overlayfs  # CoW for images, much faster than default vfs
        ];
        # we want to use the Nix shell's provided packages, not npm's
        shellHook =
        ''
        ${podmanSetupScript}
        podman run -it \
          -v $(pwd):/cdl \
          -w /cdl \
          --entrypoint /bin/sh \
          docker.io/library/node:24-bookworm
        '';
      };
    }
  );
}

