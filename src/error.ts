export default interface responseError extends Error {
    status: number,
    message: string,
    syscall: string,
    code: string
}