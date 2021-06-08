cmake_minimum_required(VERSION 3.14 FATAL_ERROR)

project(%NAME%_standalone
  LANGUAGES CXX
)

# ---- Dependencies ----

include(../build/cmake/CPM.cmake)

CPMAddPackage(
  NAME %NAME%
  SOURCE_DIR ${CMAKE_CURRENT_LIST_DIR}/..
)

# ---- Create standalone executable ----

file(GLOB sources CONFIGURE_DEPENDS ${CMAKE_CURRENT_SOURCE_DIR}/source/*.cpp)

add_executable(%NAME%_standalone ${sources})

set_target_properties(%NAME%_standalone PROPERTIES
  CXX_STANDARD 11
  OUTPUT_NAME "run"
)

target_link_libraries(%NAME%_standalone %NAME%)
