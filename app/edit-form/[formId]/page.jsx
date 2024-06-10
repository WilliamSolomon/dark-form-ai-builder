"use client"
import { db } from '@/configs'
import { JsonForms } from '@/configs/schema'
import { useUser } from '@clerk/nextjs'
import { and, eq } from 'drizzle-orm'
import { ArrowLeft } from 'lucide-react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import FormUi from '../_components/FormUi'
import Controller from '../_components/Controller'

function EditForm({ params }) {
  const { user } = useUser()
  const [jsonForm, setJsonForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [updateTrigger, setUpdateTrigger] = useState();
  const [record, setRecord] = useState([])

  const [selectedTheme, setSelectedTheme] = useState('light');
  const [selectedBackground, setSelectedBackground] = useState();
  const [selectedStyle, setSelectedStyle] = useState();

  useEffect(() => {
    if (user) {
      GetFormData();
    }
  }, [user])

  const GetFormData = async () => {
    try {
      const result = await db.select().from(JsonForms)
        .where(and(eq(JsonForms.id, params?.formId),
          eq(JsonForms.createdBy, user?.primaryEmailAddress.emailAddress)));

      setRecord(result[0])
      setJsonForm(JSON.parse(result[0].jsonform))
      setSelectedBackground(result[0].background)
      setSelectedTheme(result[0].theme)

      if (result && result.length > 0) {
        const parsedForm = JSON.parse(result[0].jsonform);
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

  useEffect(() => {
    if (updateTrigger) {
      setJsonForm(jsonForm);
      updateJsonFormInDb();
    }
  }, [updateTrigger])

  const onFieldUpdate = (value, index) => {
    jsonForm.fields[index].label = value.label
    jsonForm.fields[index].placeholder = value.placeholder
    setUpdateTrigger(Date.now)
  }

  const updateJsonFormInDb = async () => {
    const result = await db.update(JsonForms)
      .set({
        jsonform: jsonForm
      }).where(and(eq(JsonForms.id, record.id), eq(JsonForms.createdBy, user?.primaryEmailAddress.emailAddress)))
      .returning({ id: JsonForms.id })

    toast(`${jsonForm.form_title} Form Updated!`)
  }

  const deleteField = (indexToRemove) => {
    const result = jsonForm.fields.filter((item, index) => index != indexToRemove)
    console.log("Delete Result:", result)

    jsonForm.fields = result;
    setUpdateTrigger(Date.now);
  }

  const updatedControllerFields = async (value, columnName) => {
    const result = await db.update(JsonForms).set({
      [columnName]: value
    }).where(and(eq(JsonForms.id, record.id), eq(JsonForms.createdBy, user?.primaryEmailAddress.emailAddress)))
      .returning({ id: JsonForms.id })

    toast(`${columnName.charAt(0).toUpperCase() + columnName.slice(1)
    } Updated!`)
  }

  return (
    <section className='p-10'>
      <h2 className='flex gap-2 items-center my-5 cursor-pointer 
      hover:font-bold' onClick={() => router.back()}>
        <ArrowLeft /> Back
      </h2>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
        <div className='p-5 border rounded-lg shadow-md'>
          <Controller
            selectedTheme={(themeValue) => {
              updatedControllerFields(themeValue, 'theme');
              setSelectedTheme(themeValue);
            }}
            currentTheme={selectedTheme}
            selectedBackground={(backgroundValue) => {
              updatedControllerFields(backgroundValue, 'background');
              setSelectedBackground(backgroundValue)
            }}
          />
        </div>

        <div className='md:col-span-2 border rounded-lg p-5
        flex items-center justify-center'
          style={{ backgroundImage: selectedBackground }}
        >
          {loading ? (
            <Loader2 className='animate-spin' />
          ) : (
            jsonForm && <FormUi jsonForm={jsonForm}
              onFieldUpdate={onFieldUpdate}
              deleteField={(index) => deleteField(index)}
              selectedTheme={selectedTheme}
              
            />
          )}
        </div>
      </div>
    </section>
  )
}

export default EditForm

