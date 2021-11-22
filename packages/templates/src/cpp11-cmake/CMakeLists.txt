cmake_minimum_required(VERSION 3.8.2)
project(<%- name %> VERSION 0.1.0)

include(CTest)
enable_testing()

include_directories(src)
add_executable(<%- name %> main.cpp)

target_compile_features(${PROJECT_NAME} PRIVATE cxx_std_11)
set(CMAKE_CXX_STANDARD 11)

set(CPACK_PROJECT_NAME ${PROJECT_NAME})
set(CPACK_PROJECT_VERSION ${PROJECT_VERSION})
include(CPack)
