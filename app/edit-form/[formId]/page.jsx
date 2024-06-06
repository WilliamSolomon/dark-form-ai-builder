// "use client"
// import { db } from '@/configs'
// import { JsonForms } from '@/configs/schema'
// import { useUser } from '@clerk/nextjs'
// import { and, eq } from 'drizzle-orm'
// import { ArrowLeft } from 'lucide-react'
// import { useRouter } from 'next/navigation'
// import React, { useEffect, useState } from 'react'
// import FormUi  from '../_components/FormUi'

// function EditForm({ params }) {

//   const { user } = useUser()
//   const [JsonForm, setJsonForm] = useState([]);
//   const router = useRouter();

//   useEffect(() => {
//     user && GetFormData();
//   }, [user])

//   const GetFormData = async () => {
//     const result = await db.select().from(JsonForms)
//       .where(and(eq(JsonForms.id, params?.formId), eq(JsonForms.createdBy, user?.primaryEmailAddress.emailAddress)));

//     console.log(JSON.parse(result[0].jsonform));
//     setJsonForm(JSON.parse(result[0].jsonform))
//   }
//   return (
//     <section className='p-10'>
//       <h2 className='flex gap-2 items-center my-5 cursor-pointer 
//       hover:font-bold' onClick={() => router.back()}>
//         <ArrowLeft/> Back
//       </h2>
//       <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
//         <div className='p-5 border rounded-lg shadow-md'>
//           Controller
//         </div>
//         <div className='md:col-span-2 border rounded-lg p-5 h-screen flex items-center justify-center'>
//           <FormUi JsonForm={JsonForm} />
//         </div>
//       </div>
//     </section>
//   )
// }

// export default EditForm

"use client"
import { db } from '@/configs'
import { JsonForms } from '@/configs/schema'
import { useUser } from '@clerk/nextjs'
import { and, eq } from 'drizzle-orm'
import { ArrowLeft } from 'lucide-react'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import FormUi from '../_components/FormUi'

function EditForm({ params }) {
  const { user } = useUser()
  const [jsonForm, setJsonForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      GetFormData();
    }
  }, [user])

  const GetFormData = async () => {
    try {
      const result = await db.select().from(JsonForms)
        .where(and(eq(JsonForms.id, params?.formId), eq(JsonForms.createdBy, user?.primaryEmailAddress.emailAddress)));

      if (result && result.length > 0) {
        const parsedForm = JSON.parse(result[0].jsonform);
        console.log("Fetched JSON form data:", parsedForm);
        setJsonForm(parsedForm);
      } else {
        console.log("No form data found");
      }
    } catch (error) {
      console.error("Error fetching form data:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className='p-10'>
      <h2 className='flex gap-2 items-center my-5 cursor-pointer 
      hover:font-bold' onClick={() => router.back()}>
        <ArrowLeft /> Back
      </h2>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
        <div className='p-5 border rounded-lg shadow-md'>
          Controller
        </div>
        <div className='md:col-span-2 border rounded-lg p-5 flex items-center justify-center'>
          {loading ? (
            <Loader2 className='animate-spin' />
          ) : (
            jsonForm && <FormUi jsonForm={jsonForm} />
          )}
        </div>
      </div>
    </section>
  )
}

export default EditForm

