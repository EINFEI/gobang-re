import { useForm } from '@tanstack/react-form'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import z from 'zod'
import type { AnyFieldApi } from '@tanstack/react-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'

const schema = z.object({
  peerId: z.string().min(1, 'Peer ID is required'),
})
export function Connect({ connect, id }: IConnect) {
  const nav = useNavigate()
  const toHome = () => nav({ to: '/' })

  const form = useForm({
    defaultValues: {
      peerId: '',
    },
    validators: {
      onBlur: schema,
      onSubmit: schema,
    },
    onSubmit: ({ value }) => {
      const peerId = value.peerId.trim()
      connect(peerId)
    },
  })

  const Id = () =>
    id ? (
      <Input
        type="text"
        id="id"
        placeholder="id"
        readOnly
        value={id}
        className="text-white bg-black text-white md:w-1/3 sm:w-1/2"
      />
    ) : (
      <Skeleton className="w-96 h-12" />
    )

  return (
    <div className="bg-bg bg-cover bg-center aspect-auto w-screen h-screen bg-[image:var(--bg-home)]">
      <Button className="bg-white text-black m-4" onClick={toHome}>
        back
      </Button>
      <div className="flex flex-col gap-8 justify-center m-auto h-3/4">
        <div className="flex justify-center items-center gap-x-4 mx-4">
          <Label htmlFor="id" className="text-white text-4xl">
            ID
          </Label>
          {<Id />}
          <Button
            variant="outline"
            onClick={() => {
              navigator.clipboard.writeText(id)
              toast.success('Copied to clipboard')
            }}
          >
            Copy
          </Button>
        </div>

        <div className="flex justify-center items-center mx-4 ">
          <form
            className="flex flex-col justify-center items-center gap-y-4 text-white"
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
          >
            <form.Field
              name="peerId"
              children={(field) => (
                <>
                  <label className="text-white" htmlFor={field.name}>
                    Peer ID:
                  </label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="md:min-w-[400px] sm:min-w-[300px] bg-black text-white"
                  />
                  <FieldInfo field={field} />
                </>
              )}
            />
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <div className="flex gap-x-4">
                  <Button
                    className="bg-red-500 w-1/2 text-white"
                    type="reset"
                    onClick={(e) => {
                      // Avoid unexpected resets of form elements (especially <select> elements)
                      e.preventDefault()
                      form.reset()
                    }}
                  >
                    Reset
                  </Button>
                  <Button
                    className="bg-white text-black w-1/2"
                    type="submit"
                    disabled={!canSubmit}
                  >
                    {isSubmitting ? '...' : 'Submit'}
                  </Button>
                </div>
              )}
            />
          </form>
        </div>
      </div>
    </div>
  )
}

interface IConnect {
  connect: (id: string) => void
  id: string
}

function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {field.state.meta.isTouched && !field.state.meta.isValid ? (
        <em className="text-red-500">
          {field.state.meta.errors.map((error) => error.message)}
        </em>
      ) : null}
      {field.state.meta.isValidating ? 'Validating...' : null}
    </>
  )
}
