import { submissionsAtom } from "@/lib/atoms/submissions";
import { OnchainRiddle } from "@/lib/contracts";
import { useSetAtom } from "jotai";
import { toast } from "sonner";
import { usePublicClient, useWriteContract } from "wagmi";

export function useSubmitAnswer() {
  const dispatch = useSetAtom(submissionsAtom);

  const { writeContractAsync, ...mutationRest } = useWriteContract();
  const publicClient = usePublicClient();

  return {
    async submit({ submission }: { submission: string; }) {
      dispatch({ type: 'addSubmission', submission });

      // Generate a unique id for each call
      const id = `${submission}-${Date.now()}`;
      try {
        toast.info("Review the transaction in your wallet", { id, duration: Infinity });

        const txHash = await writeContractAsync({
          ...OnchainRiddle,
          functionName: 'submitAnswer',
          args: [submission],
        });

        dispatch({ type: 'setSubmissionTxHash', submission, transactionHash: txHash });
        toast.info("Transaction sent, waiting ...", { id });

        const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
        if (receipt.status === 'success') {
          toast.success("Answer submitted", { id, duration: 5000 });
        } else {
          throw new Error('Transaction was reverted');
        }
      } catch (err) {
        dispatch({ type: 'removeSubmission', submission });
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
    ...mutationRest,
  };
}
