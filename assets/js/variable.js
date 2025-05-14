export const Form = document.querySelector('#submitForm') || document.querySelector('#updateForm')
export const submitFormBtn = document.querySelector('#submitFormBtn')
export const datatable = document.querySelector('#table-grid')
export const deletebtn = document.querySelector('#deleteobjbtn')
export const TextINput = document.querySelector('#TextINput')
export const siteForm = document.querySelector('#updateFormSite') || document.querySelector('#updateFormSitewithPatch')
export const confirmDeleteBtn = document.querySelector('#confirmDeleteBtn')
export const previewImgTag = document.querySelector('#previewImg')
const stillworkingCheck = document.querySelector('#new-account')
const hideSalary = document.querySelector('#hideSalary')
import Fetch from './fetch.js'

if (stillworkingCheck) stillworkingCheck.onclick = (e) => {
    document.querySelector('#endDate').disabled = e.target.checked;
}

if (hideSalary) hideSalary.onclick = (e) => {
    document.querySelector('#amount').disabled = e.target.checked;
    document.querySelector('#slider-range').classList.toggle('hide')
}

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

    if (document.querySelector('#jobIndustries')) {
        Array.from(document.querySelector('#jobIndustries').options).forEach(option => {
            if (String(option.value) === String(res.industry._id)) {
                option.selected = true;
            }
        })
    }
}
export const updatetableDataStatus = async (status, api) => {
    try {
        const res = await Fetch.patch(api, { status }, { 'Content-Type': 'application/json' })
        Notify(res)
    } catch (error) {
        console.error(error)
    }
}

export const handleDeleteRequest = async (api) => {
    const res = await Fetch.delete(api)
    Notify(res)
    if (res.success) window.location.reload()
}

export const previewImage = (e) => {
    previewImgTag.parentNode.style.display = 'block';

    const file = e.target.files[0];
    const reader = new FileReader()
    reader.onload = (e) => previewImgTag.src = e.target.result;
    reader.readAsDataURL(file)
}

export const updateuserProject = async (api) => {
    try {
        Form.id = 'updateForm';
        const res = await Fetch.get(api)
        Form.dataset.id = res._id;
        $('#jobskills').empty()

        document.querySelector('#project_name').value = res.name;
        document.querySelector('#project_url').value = res.url;
        document.querySelector('#jobskills')
        res.skills?.forEach(skill => {
            const newOption = `<option value="${skill._id}" selected>${skill.name}</option>`;
            $('#jobskills').append(newOption)
        })
        Array.from(document.querySelector('#project_startMonth').options).forEach(option => {
            if (parseInt(option.value) === res.project_duration?.start.month) {
                option.selected = true;
            }
        })
        Array.from(document.querySelector('#project_startyear').options).forEach(option => {
            if (parseInt(option.value) === res.project_duration?.start.year) {
                option.selected = true;
            }
        })
        Array.from(document.querySelector('#project_endMonth').options).forEach(option => {
            if (parseInt(option.value) === res.project_duration?.end.month) {
                option.selected = true;
            }
        })
        Array.from(document.querySelector('#project_endyear').options).forEach(option => {
            if (parseInt(option.value) === res.project_duration?.end.year) {
                option.selected = true;
            }
        })
        document.querySelector('#description').innerHTML = res.desc;
    } catch (error) {
        console.error(error)
    }
}

export const updateusereducation = async (api) => {
    try {
        Form.id = 'updateForm';
        const res = await Fetch.get(api)
        Form.dataset.id = res._id;

        document.querySelector('#courseName').value = res.courseName
        document.querySelector('#specializedField').value = res.specializedField
        document.querySelector('#startDate').value = new Date(res.startDate).toISOString().split('T')[0]
        document.querySelector('#endDate').value = new Date(res.endDate).toISOString().split('T')[0]
        document.querySelector('#schoolORUniversity').value = res.schoolORUniversity
        document.querySelector('#description').value = res.description
    } catch (error) {
        console.error(error)
    }
}

export const updateuserexperience = async (api) => {
    try {
        Form.id = 'updateForm';
        const res = await Fetch.get(api)
        Form.dataset.id = res._id;
        document.querySelector('#companyName').value = res.companyName
        document.querySelector('#position').value = res.position
        document.querySelector('#startDate').value = new Date(res.startDate).toISOString().split('T')[0]
        document.querySelector('#description').innerHTML = res.description
        res.stillworking
            ? document.querySelector('#new-account').checked = true
            : document.querySelector('#endDate').value = new Date(res.endDate).toISOString().split('T')[0]
    } catch (error) {
        console.error(error)
    }
}

export const MultiSelectInit = (selector, api) => {
    $(selector).on('select2:open', function () {
        let timeout;
        let controller;

        try {
            const $searchField = $('.select2-container--open .select2-search__field')

            $searchField.off('input keyup')
            $searchField.on('input keyup', async function () {
                const searchTerm = $(this).val().trim()

                if (timeout) clearTimeout(timeout)
                if (controller) controller.abort()

                timeout = setTimeout(async () => {
                    controller = new AbortController()

                    try {
                        const responseArray = await Fetch.get(`${api}=${searchTerm}`, {}, controller.signal);
                        const selectedValue = $(selector).val() || [];

                        // Remove previous unselected options
                        $(selector).find('option:not(:selected)').remove()

                        responseArray.forEach(item => {
                            if (!selectedValue.includes(item._id)) {
                                const newOption = new Option(item.name, item._id, false, false)
                                $(selector).append(newOption);
                            }
                        })

                        $(selector).trigger('change.select2')

                        // Restore search field focus
                        setTimeout(() => {
                            $searchField.focus().trigger('input')
                        }, 0)
                    } catch (error) {
                        console.error('Error fetching responseArray:', error)
                    }
                }, 300)
            })
        } catch (error) {
            console.error('Error in select2 open handler:', error)
        }
    })
}