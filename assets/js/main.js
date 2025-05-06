import { Form, Notify, TextINput, submitFormBtn, datatable, deletebtn, handleDeleteRequest, updatetableDataStatus } from './variable.js'
import Fetch from './fetch.js'

const apiInput = document.querySelector('#endapi')
if (document.querySelector('.select2')) $('.select2').select2()
if (document.querySelector("#datatable")) $("#datatable").DataTable({
    "paging": true,
    "lengthChange": false,
    "searching": true,
    "ordering": true,
    "info": true,
    "autoWidth": false,
    "responsive": true,
})

window.onload = () => {
    if (window.location.pathname === '/dashboard') Notify({ success: 'Welcome to HireNest' })
}


if (datatable) datatable.onclick = (e) => {
    const endApi = `/${apiInput.value.trim()}/${e.target.dataset.id}`;
    const table_row = e.target.closest('.table-row')

    if (e.target.closest('.danger-modal')) openDangerModal(table_row, endApi)
    if (e.target.closest('.status')) updatetableDataStatus(e.target.checked, endApi)
    if (e.target.closest('.edit')) updatetableData(endApi)
}

if (Form) Form.onsubmit = async (e) => {
    try {
        e.preventDefault()
        let res;
        submitFormBtn.disabled = true;
        submitFormBtn.innerHTML = 'Submitting...';

        const formdata = new FormData(e.target)
        Form.id === 'submitForm' // Handle Data Submission To Server
            ? res = await Fetch.post(`/${apiInput.value.trim()}`, formdata)
            : res = await Fetch.put(`/${apiInput.value.trim()}/${e.target.dataset.id}`, formdata)

        Notify(res) // Notify Server Message
        if (res.success) setTimeout(() => { window.location.reload() }, 600)
    } catch (error) {
        console.error(error)
    } finally {
        submitFormBtn.disabled = false;
        submitFormBtn.innerHTML = 'Submit';
    }
}

const updatetableData = async (api) => {
    Form.id = 'updateForm';
    const res = await Fetch.get(api)
    Form.dataset.id = res._id;
    TextINput.value = res.name;
}

const openDangerModal = (table_row, api) => {
    deletebtn.onclick = () => handleDeleteRequest(table_row, api)
    return
}