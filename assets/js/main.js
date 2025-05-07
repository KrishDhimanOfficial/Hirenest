import {
    Form, Notify, siteForm, updatetableData, submitFormBtn, datatable, deletebtn,
    handleDeleteRequest, updatetableDataStatus
} from './variable.js'
import Fetch from './fetch.js'

const apiInput = document.querySelector('#endapi')

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
            : res = await Fetch.put(`/${apiInput.value.trim()}/${e.target.dataset?.id}`, formdata)

        Notify(res) // Notify Server Message
        if (res.success) setTimeout(() => { window.location.reload() }, 600)
    } catch (error) {
        console.error(error)
    } finally {
        submitFormBtn.disabled = false;
        submitFormBtn.innerHTML = 'Submit';
    }
}

const openDangerModal = (table_row, api) => {
    deletebtn.onclick = () => handleDeleteRequest(table_row, api)
    return;
}

if (siteForm) siteForm.onsubmit = async (e) => {
    try {
        e.preventDefault()
        submitFormBtn.disabled = true;
        submitFormBtn.innerHTML = 'Submitting...';

        const formdata = new FormData(e.target)
        const res = await Fetch.put(`/${apiInput.value.trim()}`, formdata)

        Notify(res) // Notify Server Message
        if (res.success) setTimeout(() => { window.location.reload() }, 600)
    } catch (error) {
        console.error(error)
    } finally {
        submitFormBtn.disabled = false;
        submitFormBtn.innerHTML = 'Submit';
    }
}

$('.select2').select2()
let controller = null;
$('#countrySelect').on('select2:open', function () {

    setTimeout(() => {
        const $searchField = $('.select2-container--open .select2-search__field')
        $searchField.off('input').on('input', async function () {
            const searchTerm = $(this).val()

            if (controller) controller.abort()

            controller = new AbortController()
            const countries = await Fetch.get(`/api/countries?q=${searchTerm}`, {}, controller.signal)
            $('#countrySelect').empty()

            // Add new options
            countries.forEach(cn => {
                const newOption = `<option value="${cn.isoCode}">${cn.name}</option>`;
                $('#countrySelect').append(newOption)
            })

            // Refresh Select2 dropdown
            $('#countrySelect').trigger('change')
        })
    }, 1000)
})

let country = null;
$('#countrySelect').on('change', function () {
    const selectedValue = $(this).val()  // Get selected value (e.g., country code)
    country = selectedValue;
    $.ajax({
        url: `/api/states?q=${selectedValue}`, // Replace with your actual endpoint
        method: 'GET',
        success: function (states) {
            // Clear old options
            $('#stateSelect').empty()

            // Add new options
            states.forEach(s => {
                const newOption = `<option value="${s.isoCode}">${s.name}</option>`;
                $('#stateSelect').append(newOption)
            })

            // Refresh Select2 dropdown
            $('#stateSelect').trigger('change')
        }
    })
})

$('#stateSelect').on('change', function () {
    const selectedValue = $(this).val()  // Get selected value (e.g., country code)
    $.ajax({
        url: `/api/cities?s=${selectedValue}&c=${country}`, // Replace with your actual endpoint
        method: 'GET',
        success: function (cities) {
            // Clear old options
            $('#citySelect').empty()

            // Add new options
            cities.forEach(c => {
                const newOption = `<option value="${c.name}">${c.name}</option>`;
                $('#citySelect').append(newOption)
            })

            // Refresh Select2 dropdown
            $('#citySelect').trigger('change')
        }
    })
})

$('#jobskills').on('select2:open', function () {

    setTimeout(() => {
        const $searchField = $('.select2-container--open .select2-search__field')
        $searchField.off('input').on('input', async function () {
            const searchTerm = $(this).val()

            if (controller) controller.abort()

            controller = new AbortController()
            const skills = await Fetch.get(`/api/job-skills?skill=${searchTerm}`, {}, controller.signal)

            // Add new options
            skills.forEach(skill => {
                const newOption = `<option value="${skill._id}">${skill.name}</option>`;
                $('#jobskills').append(newOption)
            })

            // Refresh Select2 dropdown
            $('#jobskills').trigger('change')
        })
    }, 500)
})