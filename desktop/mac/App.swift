import AppKit
import WebKit

private let canonicalURL = URL(string: "https://lordjeferies.github.io/editorial-emulator/?desktop=1&v=40")!
private let canonicalHost = canonicalURL.host

final class AppDelegate: NSObject, NSApplicationDelegate, WKNavigationDelegate, WKUIDelegate {
    private var window: NSWindow!
    private var webView: WKWebView!

    func applicationDidFinishLaunching(_ notification: Notification) {
        let configuration = WKWebViewConfiguration()
        configuration.websiteDataStore = .default()
        configuration.defaultWebpagePreferences.allowsContentJavaScript = true
        configuration.preferences.javaScriptCanOpenWindowsAutomatically = true
        configuration.applicationNameForUserAgent = "EditorialEmulatorDesktop/4.0"

        webView = WKWebView(frame: .zero, configuration: configuration)
        webView.navigationDelegate = self
        webView.uiDelegate = self
        webView.allowsMagnification = true
        webView.setValue(false, forKey: "drawsBackground")

        let style: NSWindow.StyleMask = [
            .titled,
            .closable,
            .miniaturizable,
            .resizable,
            .fullSizeContentView
        ]
        window = NSWindow(
            contentRect: NSRect(x: 0, y: 0, width: 1440, height: 900),
            styleMask: style,
            backing: .buffered,
            defer: false
        )
        window.title = "Editorial Emulator"
        window.titleVisibility = .hidden
        window.titlebarAppearsTransparent = true
        window.isReleasedWhenClosed = false
        window.minSize = NSSize(width: 900, height: 620)
        window.contentView = webView
        window.setFrameAutosaveName("EditorialEmulator.MainWindow")
        window.center()
        window.makeKeyAndOrderFront(nil)

        installMenu()
        loadCanonicalApp()
        NSApp.activate(ignoringOtherApps: true)
    }

    private func loadCanonicalApp() {
        var request = URLRequest(url: canonicalURL)
        request.cachePolicy = .reloadIgnoringLocalCacheData
        request.timeoutInterval = 30
        webView.load(request)
    }

    @objc private func reloadPage(_ sender: Any?) {
        webView.reloadFromOrigin()
    }

    @objc private func openInBrowser(_ sender: Any?) {
        if let url = webView.url ?? Optional(canonicalURL) {
            NSWorkspace.shared.open(url)
        }
    }

    private func installMenu() {
        let main = NSMenu()

        let appItem = NSMenuItem()
        main.addItem(appItem)
        let appMenu = NSMenu(title: "Editorial Emulator")
        appItem.submenu = appMenu
        appMenu.addItem(withTitle: "Abrir en navegador", action: #selector(openInBrowser(_:)), keyEquivalent: "b")
        appMenu.addItem(NSMenuItem.separator())
        appMenu.addItem(withTitle: "Salir de Editorial Emulator", action: #selector(NSApplication.terminate(_:)), keyEquivalent: "q")

        let editItem = NSMenuItem()
        main.addItem(editItem)
        let edit = NSMenu(title: "Editar")
        editItem.submenu = edit
        edit.addItem(withTitle: "Deshacer", action: Selector(("undo:")), keyEquivalent: "z")
        let redo = edit.addItem(withTitle: "Rehacer", action: Selector(("redo:")), keyEquivalent: "Z")
        redo.keyEquivalentModifierMask = [.command, .shift]
        edit.addItem(NSMenuItem.separator())
        edit.addItem(withTitle: "Cortar", action: #selector(NSText.cut(_:)), keyEquivalent: "x")
        edit.addItem(withTitle: "Copiar", action: #selector(NSText.copy(_:)), keyEquivalent: "c")
        edit.addItem(withTitle: "Pegar", action: #selector(NSText.paste(_:)), keyEquivalent: "v")
        edit.addItem(withTitle: "Seleccionar todo", action: #selector(NSText.selectAll(_:)), keyEquivalent: "a")

        let viewItem = NSMenuItem()
        main.addItem(viewItem)
        let view = NSMenu(title: "Vista")
        viewItem.submenu = view
        view.addItem(withTitle: "Recargar", action: #selector(reloadPage(_:)), keyEquivalent: "r")

        NSApp.mainMenu = main
    }

    func webView(
        _ webView: WKWebView,
        decidePolicyFor navigationAction: WKNavigationAction,
        decisionHandler: @escaping (WKNavigationActionPolicy) -> Void
    ) {
        guard let url = navigationAction.request.url else {
            decisionHandler(.cancel)
            return
        }

        if let scheme = url.scheme?.lowercased(), ["http", "https"].contains(scheme) {
            if url.host != canonicalHost {
                NSWorkspace.shared.open(url)
                decisionHandler(.cancel)
                return
            }
        }
        decisionHandler(.allow)
    }

    func webView(
        _ webView: WKWebView,
        createWebViewWith configuration: WKWebViewConfiguration,
        for navigationAction: WKNavigationAction,
        windowFeatures: WKWindowFeatures
    ) -> WKWebView? {
        if let url = navigationAction.request.url {
            if url.host == canonicalHost {
                webView.load(URLRequest(url: url, cachePolicy: .reloadIgnoringLocalCacheData, timeoutInterval: 30))
            } else {
                NSWorkspace.shared.open(url)
            }
        }
        return nil
    }

    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        showLoadError(error)
    }

    func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
        showLoadError(error)
    }

    private func showLoadError(_ error: Error) {
        let escaped = error.localizedDescription
            .replacingOccurrences(of: "&", with: "&amp;")
            .replacingOccurrences(of: "<", with: "&lt;")
            .replacingOccurrences(of: ">", with: "&gt;")
        let html = """
        <!doctype html><html><meta name='viewport' content='width=device-width,initial-scale=1'>
        <body style='margin:0;background:#090a0d;color:#f5f6f8;font:15px -apple-system;padding:48px'>
        <h1 style='font-size:28px'>Editorial Emulator está sin conexión</h1>
        <p style='color:#98a0ad;max-width:620px'>No pudimos cargar la aplicación. Tus datos locales no se han borrado. Comprueba la conexión y vuelve a intentar.</p>
        <p style='color:#777'>\(escaped)</p>
        <button onclick='location.href="https://lordjeferies.github.io/editorial-emulator/?desktop=1&v=40"' style='padding:12px 16px;border:0;border-radius:12px;font-weight:700'>Volver a intentar</button>
        </body></html>
        """
        webView.loadHTMLString(html, baseURL: canonicalURL)
    }

    func applicationShouldTerminateAfterLastWindowClosed(_ sender: NSApplication) -> Bool {
        true
    }
}

let app = NSApplication.shared
let delegate = AppDelegate()
app.delegate = delegate
app.setActivationPolicy(.regular)
app.run()
