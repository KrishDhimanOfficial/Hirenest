export const Form = document.querySelector('#submitForm') || document.querySelector('#updateForm')
export const submitFormBtn = document.querySelector('#submitFormBtn')
export const datatable = document.querySelector('#table-grid')
export const deletebtn = document.querySelector('#deleteobjbtn')
export const TextINput = document.querySelector('#TextINput')
import Fetch from './fetch.js'

export const Notify = (data) => {
    if (data.success) toastr.success(data.success)
    if (data.warning) toastr.warning(data.warning)
    if (data.error) toastr.error(data.error)
    if (data.errors) data.errors.forEach(error => toastr.error(error))
    return;
}

export const updatetableDataStatus = async (status, api) => {
    try {
        const res = await Fetch.patch(api, { status })
        Notify(res)
    } catch (error) {
        console.error(error)
    }
}

export const handleDeleteRequest = async (table_row, api) => {
    const res = await Fetch.delete(api)
    Notify(res)
    if (res.success) table_row.remove(), window.location.reload()
}
