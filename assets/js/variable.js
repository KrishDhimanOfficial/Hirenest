export const Form = document.querySelector('#submitForm') || document.querySelector('#updateForm')
export const submitFormBtn = document.querySelector('#submitFormBtn')
export const datatable = document.querySelector('#table-grid')
export const deletebtn = document.querySelector('#deleteobjbtn')
export const TextINput = document.querySelector('#TextINput')
export const siteForm = document.querySelector('#updateFormSite') || document.querySelector('#updateFormSitewithPatch')
export const confirmDeleteBtn = document.querySelector('#confirmDeleteBtn')
export const previewImgTag = document.querySelector('#previewImg')
import Fetch from './fetch.js'

export const Notify = (data) => {
    if (data.success) toastr.success(data.success)
    if (data.warning) toastr.warning(data.warning)
    if (data.info) toastr.warning(data.info)
    if (data.error) toastr.error(data.error)
    if (data.redirect) window.location.href = data.redirect
    if (data.errors) data.errors.forEach(error => toastr.error(error))
    return;
}

export const updatetableData = async (api) => {
    Form.id = 'updateForm';
    const res = await Fetch.get(api)
    Form.dataset.id = res._id;
    TextINput.value = res.name;
}
export const updatetableDataStatus = async (status, api) => {
    try {
        const res = await Fetch.patch(api, { status }, { 'Content-Type': 'application/json' })
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

export const previewImage = (e) => {
    previewImgTag.parentNode.style.display = 'block';

    const file = e.target.files[0];
    const reader = new FileReader()
    reader.onload = (e) => previewImgTag.src = e.target.result;
    reader.readAsDataURL(file)
}