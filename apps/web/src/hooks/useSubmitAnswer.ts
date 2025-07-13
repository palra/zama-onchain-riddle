import { addSubmissionAtom, setSubmissionTxHashAtom, removeSubmissionAtom } from "@/lib/atoms/submissions";
import { OnchainRiddle } from "@/lib/contracts";
import { useAtom } from "jotai";
import { toast } from "sonner";
import { useWriteContract, usePublicClient } from "wagmi";

export function useSubmitAnswer() {
  const [, addSubmission] = useAtom(addSubmissionAtom);
  const [, setSubmissionTxHash] = useAtom(setSubmissionTxHashAtom);
  const [, removeSubmission] = useAtom(removeSubmissionAtom);

  const { writeContractAsync, ...mutationRest } = useWriteContract();
  const publicClient = usePublicClient();

  return {
    async submit({ submission }: { submission: string; }) {
      addSubmission({ submission });

      // Generate a unique id for each call
      const id = `${submission}-${Date.now()}`;
      try {
        toast.info("Review the transaction in your wallet", { id, duration: Infinity });

        const txHash = await writeContractAsync({
          ...OnchainRiddle,
          functionName: 'submitAnswer',
          args: [submission]
        });

        setSubmissionTxHash({ submission, transactionHash: txHash });
        toast.info("Transaction sent, waiting ...", { id });

        const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
        if (receipt.status === 'success') {
          setSubmissionTxHash({ submission, transactionHash: txHash });
          toast.success("Answer submitted", { id, duration: 5000 });
        } else {
          throw new Error('Transaction was reverted');
        }
      } catch (err) {
        removeSubmission({ submission });
        let message = "Unexpected error. Please try again.";
        if (err instanceof Error) {
          // Wagmi/viem user rejection error codes
          if (
            err.message.includes("User rejected") ||
            err.message.includes("user rejected") ||
            err.message.includes("User denied") ||
            err.message.includes("user denied") ||
            err.message.includes("rejected the request") ||
            err.message.includes("denied transaction signature")
          ) {
            message = "You denied the signature request. Transaction cancelled.";
          } else {
            message = err.message;
          }
        }
        toast.error(message, { id, duration: 5000 });

        throw err;
      }
    },
    ...mutationRest
  }
}