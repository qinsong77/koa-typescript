import { HTTP_CODE } from './code'

export class BaseException extends Error {
    // 状态码
    status: number
    // 提示信息
    message: string
}

export class NotFoundException extends BaseException {
    status = HTTP_CODE.NOT_FOUND

    constructor(msg?: string) {
        super()
        this.message = msg || '无此内容'
    }
}

export class UnAuthorizedException extends BaseException {
    status = HTTP_CODE.UnAuthorized

    constructor(msg?: string) {
        super()
        this.message = msg || '尚未登录'
    }
}

export class ForbiddenException extends BaseException {
    status = HTTP_CODE.FORBIDDEN

    constructor(msg?: string) {
        super()
        this.message = msg || '权限不足'
    }
}

export class ErrorHandleRequest extends BaseException {
    status = HTTP_CODE.BAD_REQUEST

    constructor(msg?: string) {
        super()
        this.message = msg || '请求操作失败'
    }
}
