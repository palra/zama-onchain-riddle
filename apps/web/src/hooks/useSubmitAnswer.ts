import { addSubmissionAtom, removeSubmissionAtom, setSubmissionConfirmedAtom } from "@/lib/atoms/submissions";
import { OnchainRiddle } from "@/lib/contracts";
import { useAtom } from "jotai";
import { toast } from "sonner";
import { useWriteContract, usePublicClient } from "wagmi";


export function useSubmitAnswer() {
  const [, addSubmission] = useAtom(addSubmissionAtom);
  const [, setSubmissionConfirmed] = useAtom(setSubmissionConfirmedAtom);
  const [, removeSubmission] = useAtom(removeSubmissionAtom);

  const { writeContractAsync, ...mutationRest } = useWriteContract();
  const publicClient = usePublicClient();

  return {
    async submit({ submission }: { submission: string; }) {
      addSubmission({ submission })

      let hash: `0x${string}` | undefined;
      try {
        hash = await writeContractAsync({
          ...OnchainRiddle,
          functionName: 'submitAnswer',
          args: [submission]
        });
        toast.info("Transaction sent, waiting ...", { id: hash });
      
        const receipt = await publicClient.waitForTransactionReceipt({ hash });
        if (receipt.status === 'success') {
          setSubmissionConfirmed({ submission, transactionHash: hash });
          toast.success("Answer submitted", { id: hash });
        } else {
          throw new Error('Transaction was reverted');
        }
      } catch (err) {
        removeSubmission({ submission });
        toast.error(err instanceof Error ? err.message : "Unexpected error")
        console.error("useSubmitAnswer.submit", err, { id: hash });
      }
    },
    ...mutationRest
  }
}