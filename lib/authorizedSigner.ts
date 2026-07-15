import { BrowserProvider } from 'ethers'
import type { Eip1193Provider } from 'ethers'

type SignerContext = {
  provider: BrowserProvider
  signer: Awaited<ReturnType<BrowserProvider['getSigner']>>
  signerAddress: string
}

/**
 * Get an authorized signer from the wallet provider.
 * 
 * Critical utility — prevents MetaMask error 4100 (unauthorized) on Opera
 * and Chromium-based browsers. Always use this instead of 
 * `new BrowserProvider(walletProvider).getSigner()` directly.
 */
export async function getAuthorizedSigner(
  walletProvider: Eip1193Provider,
  expectedAddress?: string,
): Promise<SignerContext> {
  const provider = new BrowserProvider(walletProvider)
  const normalizedExpected = expectedAddress?.toLowerCase()

  // Try eth_accounts first (silent), fall back to eth_requestAccounts (prompts user)
  let accounts = (await walletProvider.request({ method: 'eth_accounts' })) as string[]
  if (!accounts?.length) {
    accounts = (await walletProvider.request({ method: 'eth_requestAccounts' })) as string[]
  }
  if (!accounts?.length) throw new Error('No wallet account authorized')

  let signerAddress =
    accounts.find((a) => a.toLowerCase() === normalizedExpected) ?? accounts[0]

  if (normalizedExpected && signerAddress.toLowerCase() !== normalizedExpected) {
    accounts = (await walletProvider.request({ method: 'eth_requestAccounts' })) as string[]
    signerAddress =
      accounts.find((a) => a.toLowerCase() === normalizedExpected) ?? accounts[0] ?? signerAddress
  }

  const signer = await provider.getSigner(signerAddress)
  const finalAddress = await signer.getAddress()
  if (normalizedExpected && finalAddress.toLowerCase() !== normalizedExpected) {
    throw new Error('Connected wallet account does not match selected dapp account')
  }

  return { provider, signer, signerAddress: finalAddress }
}
